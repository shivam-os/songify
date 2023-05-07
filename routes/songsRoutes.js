const express = require("express");
const router = express.Router();
const songsController = require("../controllers/songsController");
const passport = require("passport");

//----------------------Protected Routes--------------------

//Only allow logged in users
router.use(passport.authenticate("jwt", { session: false }));

//GET method to return list of all songs available
router.get("/", songsController.getAllSongs);

//GET method to get a list of songs based on the search term
router.get("/search", songsController.searchSong);

//GET method to return the song with the specified id
router.get("/:songid", songsController.getSingleSong);

module.exports = router;
