const express = require("express");
const router = express.Router();
const userValidator = require("../utils/validators/userValidator");
const userController = require("../controllers/userController");
const passport = require("passport");

//----------------------Public Routes-----------------------

//POST method to create a new user
router.post("/signup", userValidator.signup, userController.signup);

//POST method to login an existing user
router.post("/login", userValidator.login, userController.login);

//----------------------Protected Routes--------------------

//POST method to logout the logged in user
router.post(
  "/logout",
  passport.authenticate("jwt", { session: false }),
  userController.logout
);

module.exports = router;
