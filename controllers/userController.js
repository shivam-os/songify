const User = require("../config/db").user;
const checkErrors = require("../utils/validators/checkErrors");
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken");
require("dotenv").config();

const checkExistingUser = async (email) => {
  try {
    const existingUser = await User.findOne({
      where: { email: email },
      attributes: ["name"],
    });
    return existingUser;
  } catch (err) {
    console.log(err);
  }

  return null;
};

exports.signup = async (req, res) => {
  //Handle errors coming from the signup userValidator
  checkErrors(req, res);

  try {
    const { name, email, password } = req.body;

    //Check if user with given email already exists in the database
    if (await checkExistingUser(email)) {
      return res.status(403).json({
        err: "User with given email already exists! Check the entered email or log in.",
      });
    }

    //Hash the password before storing it in database
    const hashedPassword = await bcryptjs.hash(password, 10);
    console.log(hashedPassword)

    await User.create({
      name: name,
      email: email,
      password: hashedPassword,
    });

    return res.status(201).json({ msg: "User created successfully!" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ err: "Something has went wrong. Please try again later!" });
  }
};

exports.login = async (req, res) => {
  //Hanldle errors coming from login userValidator
  checkErrors(req, res);

  try {
    const { email, password } = req.body;

    //Check if user with given email already exists in the database
    const existingUser = await checkExistingUser(email);

    //If user not exists in the database
    if (!existingUser) {
      return res
        .status(404)
        .json({ err: "User not found! Check email again or sign up." });
    }

    //Get password of the user from database
    const user = await User.findOne({
      where: { email: email },
    });

    //Compare the entered password with stored password from database
    const doesPasswordMatch = await bcryptjs.compare(
      password,
      user.dataValues.password
    );
    if (!doesPasswordMatch) {
      return res
        .status(400)
        .json({ err: "Incorrect email or password! Please try again." });
    }

    //If password is matched the create a jwt and send it
    const payload = { userId: user.dataValues.userId };
    const bearerToken = await jwt.sign(
      payload,
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "3h",
      }
    );

    return res
      .status(201)
      .cookie("token", bearerToken, {
        expires: new Date(Date.now() + 3 * 60 * 60 * 1000), //Cookie will be removed in 3 hours
        httpOnly: true,
      })
      .json({ msg: `Welcome back ${user.name}! You are now logged in.` });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ err: "Something has went wrong. Please try again later!" });
  }
};

exports.logout = (req, res) => {
  return res
    .status(201)
    .clearCookie("token", req.cookies.token, {
      expires: new Date(Date.now() + 3 * 60 * 60 * 1000), //Cookie will be removed in 3 hours
      httpOnly: true,
    })
    .json({ msg: `Now you are logged out! We hope to see you soon.` });
};
