const Playlist = require("../config/db").playlist;
const Song = require("../config/db").song;
const PlaylistSong = require("../config/db").playlistSong;
const songUtils = require("../utils/songUtils");
const checkErrors = require("../utils/validators/checkErrors");

//Checks if the user has playlist with given id
const checkIfPlaylistExist = async (playlistId, userId) => {
  try {
    const response = await Playlist.findOne({
      where: { playlistId: playlistId, userId: userId },
      attributes: ["playlistId"],
    });
    if (response) {
      return true;
    }
  } catch (err) {
    console.log(err);
  }

  return false;
};

//Checks if song exists in database or not
const checkIfSongExist = async (songId) => {
  try {
    const response = await Song.findOne({
      where: { songId: songId },
    });
    if (response) {
      return true;
    }
  } catch (err) {
    console.log(err);
  }

  return false;
};

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

//GET method to get all details of playlist with given id
exports.getSinglePlaylist = async (req, res) => {
  try {
    if (
      !(await checkIfPlaylistExist(
        req.params.playlistid,
        req.user.dataValues.userId
      ))
    ) {
      return res
        .status(404)
        .json({ err: "Playlist with given id does not exist!" });
    }

    const playlistData = await Playlist.findAll({
      where: { playlistId: req.params.playlistid },
      attributes: ["playlistId", "name", "description"],
      include: [
        {
          model: Song,
          through: "playlist_songs",
          attributes: {exclude: ["createdAt", "updatedAt"]},
          through: {
            attributes: []
          },
        },
      ],
    });

    return res.status(201).json(playlistData);
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

    if (
      !(await checkIfPlaylistExist(
        req.params.playlistid,
        req.user.dataValues.userId
      ))
    ) {
      return res
        .status(404)
        .json({ err: "Playlist with given id does not exist!" });
    }

    //Update the playlist data
    await Playlist.update(
      { name: name, description: description },
      {
        where: {
          playlistId: req.params.playlistid,
        },
      }
    );

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
    if (
      !(await checkIfPlaylistExist(
        req.params.playlistid,
        req.user.dataValues.userId
      ))
    ) {
      return res
        .status(404)
        .json({ err: "Playlist with given id does not exist!" });
    }

    //Delete the given playlist
    await Playlist.destroy({
      where: {
        playlistId: req.params.playlistid,
      },
    });

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

    //Check if user has playlist with given id
    if (
      !(await checkIfPlaylistExist(
        req.params.playlistid,
        req.user.dataValues.userId
      ))
    ) {
      return res
        .status(404)
        .json({ err: "Playlist with given id does not exist!" });
    }

    //Get song details
    const songDetails = await songUtils.getSongFromId(songId);

    //Check if song was found or not
    if (Object.keys(songDetails).length === 0) {
      return res.status(404).json({
        err: "Song with given id does not exist. Please recheck the songId!",
      });
    }

    //Check if song with given id exists in database already or not
    if (!(await checkIfSongExist(songId))) {
      await Song.create(songDetails);
    }

    //Add songId & playlistId to playlist_songs table
    await PlaylistSong.create({
      songId: songId,
      playlistId: req.params.playlistid,
    });

    return res.status(201).json({ msg: "Song added to the given playlist!" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ err: "Something has went wrong. Please try again later!" });
  }
};

//DELETE method to delete a song with given :songid from a playlist with :playlistid
exports.deleteSongFromPlaylist = async (req, res) => {
  //Handle errors coming from the checkSongId of songsValidator
  checkErrors(req, res);

  try {
    const { songId } = req.body;

    //Check if user has playlist with given id
    if (
      !(await checkIfPlaylistExist(
        req.params.playlistid,
        req.user.dataValues.userId
      ))
    ) {
      return res
        .status(404)
        .json({ err: "Playlist with given id does not exist!" });
    }

    //If song does not exists
    if (!(await checkIfSongExist(songId))) {
      return res
        .status(404)
        .json({ err: "Song with given id does not exist!" });
    }

    await PlaylistSong.destroy({
      where: { playlistId: req.params.playlistid, songId: songId },
    });

    return res
      .status(200)
      .json({ msg: "Song deleted from playlist successfully!" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ err: "Something has went wrong. Please try again later!" });
  }
};
