const express = require("express");
const router = express.Router();
const passport = require("passport")
const playlistsController = require("../controllers/playlistsController");
const playlistsValidator = require("../utils/validators/playlistsValidator");
const songsValidator = require("../utils/validators/songsValidator");

//GET method to get all the playlists created by the user
router.get("/", passport.authenticate("jwt", {session: false}), playlistsController.getAllPlaylists );

//GET method to get a single playlist with given id
router.get("/:playlistid", passport.authenticate("jwt", {session: false}), playlistsController.getSinglePlaylist)

//POST method to create a new playlist
router.post("/", passport.authenticate("jwt", {session: false}), playlistsValidator.createPlaylist, playlistsController.createPlaylist);

//PUT method to create a new playlist
router.put("/:playlistid", passport.authenticate("jwt", {session: false}), playlistsValidator.createPlaylist, playlistsController.updatePlaylist);

//DELETE method to delete an existing playlist
router.delete("/:playlistid", passport.authenticate("jwt", {session: false}), playlistsController.deletePlaylist)

//POST method to add a song to the playlist with given id
router.post("/:playlistid/songs", songsValidator.checkSongId, playlistsController.addSongToPlaylist);

//DELETE method to delete a song from the playlist with given id
router.delete("/:playlistid/songs", songsValidator.checkSongId, playlistsController.deleteSongFromPlaylist);


module.exports = router;
