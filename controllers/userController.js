const User = require("../config/db").user;
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const httpResponses = require("../utils/httpResponses");
const responseObj = "User";
const accessTokenValidity = 3 * 60 * 60 * 1000; //3 hours in milliseconds
const accessTokenOptions = {
  expires: new Date(Date.now() + accessTokenValidity),
  httpOnly: true,
};

//POST method to register a new user
exports.signup = async (req, res) => {
  //Handle errors coming from the signup userValidator
  if (httpResponses.validationError(req, res)) {
    return;
  }

  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({
      where: { email },
    });

    //Check if user with given email already exists
    if (existingUser) {
      return httpResponses.existsError(res, responseObj);
    }

    //Hash the password before storing it in database
    const hashedPassword = await bcryptjs.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return httpResponses.createdResponse(res, responseObj);
  } catch (err) {
    console.log(err);
    return httpResponses.serverError(res);
  }
};

//POST method to login an existing user
exports.login = async (req, res) => {
  //Handle errors coming from the signup userValidator
  if (httpResponses.validationError(req, res)) {
    return;
  }

  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({
      where: { email },
    });

    //Check if user with given email doesn't exist
    if (!existingUser) {
      return httpResponses.notFoundError(res, responseObj);
    }

    //Compare the entered password with stored password from database
    const doesPasswordMatch = await bcryptjs.compare(
      password,
      existingUser.dataValues.password
    );
    if (!doesPasswordMatch) {
      return res
        .status(400)
        .json({ err: "Incorrect email or password! Please try again." });
    }

    //If password is matched the create a jwt and send it
    const payload = { userId: existingUser.dataValues.userId };
    const bearerToken = await jwt.sign(
      payload,
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: `${accessTokenValidity}`,
      }
    );

    return res
      .status(201)
      .cookie("token", bearerToken, accessTokenOptions)
      .json({
        msg: `Welcome back ${existingUser.name}! You are now logged in.`,
      });
  } catch (err) {
    console.log(err);
    return httpResponses.serverError(res);
  }
};

//POST method to logout the existing user
exports.logout = (req, res) => {
  return res
    .status(201)
    .clearCookie("token", req.cookies.token, accessTokenOptions)
    .json({ msg: `Now you are logged out! We hope to see you soon.` });
};
