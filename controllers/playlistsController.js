const Playlist = require("../config/db").playlist;
const Song = require("../config/db").song;
const PlaylistSong = require("../config/db").playlistSong;
const playlist = require("../models/playlist");
const songUtils = require("../utils/songUtils");
const checkErrors = require("../utils/validators/checkErrors")
const { validationResult } = require("express-validator");

//GET method to get all the playlists created by the user
exports.getAllPlaylists = async (req, res) => {
  try {
    const userPlaylists = await Playlist.findAll({
      attributes: ["playlistId", "name", "description"],
      where: { userId: req.user.dataValues.userId },
    });
    console.log("user", req.user.dataValues.userId);
    //If no playlists found for a user
    if (userPlaylists == undefined) {
      return res
        .status(404)
        .json({ msg: "No playlists found! Create them to get the list." });
    }

    console.log("playlists", userPlaylists);

    return res.status(200).json(userPlaylists);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ err: "Something has went wrong. Please try again later!" });
  }
};

//POST method to create a playlist
exports.createPlaylist = async (req, res) => {
  //Handle errors coming from createPlaylist of playlistsValidator
  checkErrors(req, res);

  try {
    const { name, description } = req.body;
    const { userId } = req.user.dataValues;
    await Playlist.create({
      userId: userId,
      name: name,
      description: description,
    });

    return res.status(201).json({ msg: "Playlist created successfully!" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ err: "Something has went wrong. Please try again later!" });
  }
};

//GET method to get playlist with given id
exports.getSinglePlaylist = async (req, res) => {
  try {
    const existingPlaylist = await Playlist.findOne({
      attributes: ["name", "description"],
      where: { playlistId: req.params.playlistid },
    });

    //If playlist does not exist
    if (!existingPlaylist) {
      return res
        .status(404)
        .json({ err: "Playlist with given id is not found!" });
    }

    return res.status(201).json(existingPlaylist);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ err: "Something has went wrong. Please try again later!" });
  }
};

//PUT method to update playlist with given id
exports.updatePlaylist = async (req, res) => {
  //Handle errors coming from createPlaylist of playlistsValidator
  checkErrors(req, res);

  try {
    const { name, description } = req.body;
    const existingPlaylist = await Playlist.update(
      { name: name, description: description },
      {
        where: { playlistId: req.params.playlistid },
      }
    );

    //If playlist does not exist
    if (existingPlaylist[0] === 0) {
      return res
        .status(404)
        .json({ err: "Playlist with given id does not exist!" });
    }

    return res.status(201).json({ msg: "Playlist updated successfully!" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ err: "Something has went wrong. Please try again later!" });
  }
};

//DELETE method to delete playlist with given id
exports.deletePlaylist = async (req, res) => {
  try {
    const deletedPlaylist = await Playlist.destroy({
      where: { playlistId: req.params.playlistid },
    });

    //If playlist does not exits
    if (deletedPlaylist) {
      return res
        .status(404)
        .json({ err: "Playlist with given id does not exist!" });
    }

    return res.status(200).json({ msg: "Playlist deleted successfully!" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ err: "Something has went wrong. Please try again later!" });
  }
};

//POST method to add a song with given songId to a playlist with given id
exports.addSongToPlaylist = async (req, res) => {
  //Handle errors coming from the checkSongId of songsValidator
  checkErrors(req, res);

  try {
    const { songId } = req.body;
    const songDetails = songUtils.getSongFromId(songId);

    //Add song details to the songs table
    await Song.create({
      ...songDetails,
      externalSongId: songId,
    });

    //Add songId and playlistId to table junction table playlist_songs
    await PlaylistSong.create({
      playlistId: req.params.playlistid,
      songId: songId,
    });

    return res.send(201).json({msg: "Song added to the given playlist!"})
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ err: "Something has went wrong. Please try again later!" });
  }
};

//DELETE method to delete a song with given :songid from a playlist with :playlistid
exports.deleteSongFromPlaylist = (req, res) => {

};
