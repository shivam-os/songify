const express = require("express");
const router = express.Router();
const songsController = require("../controllers/songsController");
const passport = require("passport");

//GET method to return list of all songs available
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  songsController.getAllSongs
);

//GET method to get a list of songs based on the search term
router.get(
  "/search",
  passport.authenticate("jwt", { session: false }),
  songsController.searchSong
);

//GET method to return the song with the specified id
router.get(
  "/:songid",
  passport.authenticate("jwt", { session: false }),
  songsController.getSingleSong
);

module.exports = router;
