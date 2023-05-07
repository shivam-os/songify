const express = require("express");
const router = express.Router();
const passport = require("passport");
const playlistsController = require("../controllers/playlistsController");
const playlistsValidator = require("../utils/validators/playlistsValidator");
const songsValidator = require("../utils/validators/songsValidator");

//----------------------Protected Routes--------------------

//Only allow logged in users
router.use(passport.authenticate("jwt", { session: false }));

//GET method to get all the playlists created by the user
router.get("/", playlistsController.getAllPlaylists);

//GET method to get a single playlist with given id
router.get("/:playlistid", playlistsController.getSinglePlaylist);

//POST method to create a new playlist
router.post(
  "/",
  playlistsValidator.createPlaylist,
  playlistsController.createPlaylist
);

//PUT method to create a new playlist
router.put(
  "/:playlistid",
  playlistsValidator.createPlaylist,
  playlistsController.updatePlaylist
);

//DELETE method to delete an existing playlist
router.delete("/:playlistid", playlistsController.deletePlaylist);

//POST method to add a song to the playlist with given id
router.post(
  "/:playlistid/songs",
  songsValidator.checkSongId,
  playlistsController.addSongToPlaylist
);

//DELETE method to delete a song from the playlist with given id
router.delete(
  "/:playlistid/songs",
  songsValidator.checkSongId,
  playlistsController.deleteSongFromPlaylist
);

module.exports = router;
