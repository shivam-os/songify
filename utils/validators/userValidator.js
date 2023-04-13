const { body } = require("express-validator");

//Validator for registering a new user
exports.signup = [
  body("name")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Name field cannot be empty!")
    .isLength({ min: 3, max: 100 })
    .withMessage(
      "Name field must contain minimum 3 letters and maximum 100 letters!"
    )
    .isAlpha("en-US", { ignore: " " })
    .withMessage(
      "Name field cannot contain any numbers or special characters!"
    ),

  body("email")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Email field cannot be empty!")
    .normalizeEmail()
    .isEmail()
    .withMessage("Invalid email address!"),

  body("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password field cannot be empty!")
    .isStrongPassword()
    .withMessage(
      "Password must be atleast 8 characters long & must include- one uppercase letter, one lowercase letter, one special character, one digit!"
    ),
];

//Validator for login of an existing user
exports.login = [
  body("email")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Email field cannot be empty!")
    .normalizeEmail()
    .isEmail()
    .withMessage("Invalid email address!"),

  body("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password field cannot be empty!"),
];
