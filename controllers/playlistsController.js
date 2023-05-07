const Playlist = require("../config/db").playlist;
const Song = require("../config/db").song;
const PlaylistSong = require("../config/db").playlistSong;
const songUtils = require("../utils/songUtils");
const httpResponses = require("../utils/httpResponses");
const responseObj = "Playlist";

//GET method to get all the playlists created by the user
exports.getAllPlaylists = async (req, res) => {
  try {
    const userPlaylists = await Playlist.findAll({
      where: { userId: req.user.dataValues.userId },
      attributes: ["playlistId", "name", "description"],
    });

    //If no playlists found for a user
    if (userPlaylists.length === 0) {
      return res
        .status(404)
        .json({ msg: "No playlists found! Create them to get the list." });
    }

    return res.status(200).json(userPlaylists);
  } catch (err) {
    console.log(err);
    return httpResponses.serverError(res);
  }
};

//POST method to create a playlist
exports.createPlaylist = async (req, res) => {
  //Handle errors coming from createPlaylist of playlistsValidator
  if (httpResponses.validationError(req, res)) {
    return;
  }

  try {
    const { name, description } = req.body;
    const { userId } = req.user.dataValues;

    await Playlist.create({
      userId,
      name,
      description,
    });

    return httpResponses.createdResponse(res, responseObj);
  } catch (err) {
    console.log(err);
    return httpResponses.serverError(res);
  }
};

//GET method to get all details of playlist with given id
exports.getSinglePlaylist = async (req, res) => {
  try {
    const { userId } = req.user.dataValues;
    const playlistData = await Playlist.findOne({
      where: { playlistId: req.params.playlistid, userId },
      attributes: ["playlistId", "name", "description"],
      include: [
        {
          model: Song,
          through: "playlist_songs",
          attributes: { exclude: ["createdAt", "updatedAt"] },
          through: {
            attributes: [],
          },
        },
      ],
    });

    //If playlist with given id doesn't exist
    if (!playlistData) {
      return httpResponses.notFoundError(res, responseObj);
    }

    return res.status(201).json(playlistData);
  } catch (err) {
    console.log(err);
    return httpResponses.serverError(res);
  }
};

//PUT method to update playlist with given id
exports.updatePlaylist = async (req, res) => {
  //Handle errors coming from createPlaylist of playlistsValidator
  if (httpResponses.validationError(req, res)) {
    return;
  }

  try {
    const { name, description } = req.body;
    const { userId } = req.user.dataValues;

    const existingPlaylist = await Playlist.findOne({
      where: { playlistId: req.params.playlistid, userId },
    });

    //If playlist with given id doesn't exist
    if (!existingPlaylist) {
      return httpResponses.notFoundError(res, responseObj);
    }

    //Update the playlist data
    await existingPlaylist.update({ name: name, description: description });

    return httpResponses.updatedResponse(res, responseObj);
  } catch (err) {
    console.log(err);
    return httpResponses.serverError(res);
  }
};

//DELETE method to delete playlist with given id
exports.deletePlaylist = async (req, res) => {
  const { userId } = req.user.dataValues;
  
  try {
    const existingPlaylist = await Playlist.findOne({
      where: { playlistId: req.params.playlistid, userId },
    });

    //If playlist with given id doesn't exist
    if (!existingPlaylist) {
      return httpResponses.notFoundError(res, responseObj);
    }

    //Delete songs of the given playlist
    await PlaylistSong.destroy({
      where: { playlistId: req.params.playlistid },
    });

    //Delete the given playlist
    await existingPlaylist.destroy();

    return httpResponses.deletedResponse(res, responseObj);
  } catch (err) {
    console.log(err);
    return httpResponses.serverError(res);
  }
};

//POST method to add a song with given songId to a playlist with given id
exports.addSongToPlaylist = async (req, res) => {
  //Handle errors coming from the checkSongId of songsValidator
  if (httpResponses.validationError(req, res)) {
    return;
  }

  try {
    const { songId } = req.body;
    const { userId } = req.user.dataValues;

    const existingPlaylist = Playlist.findOne({
      where: { playlistId: req.params.playlistid, userId },
    });

    //If playlist with given id doesn't exist
    if (!existingPlaylist) {
      return httpResponses.notFoundError(res, responseObj);
    }

    //Get song details
    const songDetails = await songUtils.getSongFromId(songId);

    //Check if song was found or not
    if (Object.keys(songDetails).length === 0) {
      return httpResponses.notFoundError(res, "Song");
    }

    const existingSong = await Song.findOne({ where: { songId } });

    //Check if song with given id exists in database already or not
    if (!existingSong) {
      await Song.create(songDetails);
    }

    //Check if song with given id exists already in the playlist
    const songInPlaylist = await PlaylistSong.findOne({
      where: { playlistId: req.params.playlistid, songId },
    });

    if (songInPlaylist) {
      return httpResponses.existsError(res, "Song");
    }

    //Add songId & playlistId to playlist_songs table
    await PlaylistSong.create({
      songId: songId,
      playlistId: req.params.playlistid,
    });

    return res.status(201).json({ msg: "Song added to the given playlist!" });
  } catch (err) {
    console.log(err);
    return httpResponses.serverError(res);
  }
};

//DELETE method to delete a song with given :songid from a playlist with :playlistid
exports.deleteSongFromPlaylist = async (req, res) => {
  //Handle errors coming from the checkSongId of songsValidator
  if (httpResponses.validationError(req, res)) {
    return;
  }

  try {
    const { songId } = req.body;
    const { userId } = req.user.dataValues;

    const existingPlaylist = await Playlist.findOne({
      where: { playlistId: req.params.playlistid, userId },
    });

    //If playlist with given id doesn't exist
    if (!existingPlaylist) {
      return httpResponses.notFoundError(res, responseObj);
    }

    const existingSong = await PlaylistSong.findOne({
      where: { playlistId: req.params.playlistid, songId },
    });

    //If song does not exists
    if (!existingSong) {
      return res
        .status(404)
        .json({ err: "Song with given id does not exist!" });
    }

    await existingSong.destroy();

    return httpResponses.deletedResponse(res, "Song");
  } catch (err) {
    console.log(err);
    return httpResponses.serverError(res);
  }
};
