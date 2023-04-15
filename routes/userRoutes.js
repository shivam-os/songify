const express = require("express");
const router = express.Router();
const userValidator = require("../utils/validators/userValidator");
const userController = require("../controllers/userController");
const passport = require("passport");

//POST method to create a new user
router.post("/signup", userValidator.signup, userController.signup);

//POST method to login an existing user
router.post("/login", userValidator.login, userController.login);

//POST method to logout the logged in user
router.post("/logout", passport.authenticate("jwt", { session: false }), userController.logout);

//Ideas
router.post("/recover");
router.get("/friends");

module.exports = router;
