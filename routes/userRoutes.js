const express = require("express");
const router = express.Router();

//POST method to create a new user
router.post("/signup");

//POST method to login an existing user
router.post("/login");

//POST method to logout the logged in user
router.post("/logout");

//Ideas
router.post("/recover");
router.get("/friends")

module.exports = router;
