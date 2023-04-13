const Playlist = require("../config/db").playlist;
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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

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

    return res.status(201).json({msg: "Playlist updated successfully!"});
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
    const deletedPlaylist = await Playlist.destroy({where: {playlistId: req.params.playlistid}});
    
    //If playlist does not exits
    if (deletedPlaylist) {
      return res.status(404).json({err: "Playlist with given id does not exist!"})
    }

    return res.status(200).json({msg: "Playlist deleted successfully!"})
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ err: "Something has went wrong. Please try again later!" });
  }
};

//POST method to add a song with given songId to a playlist with given id
exports.addSongToPlaylist = (req, res) => {};

//DELETE method to delete a song with given :songid from a playlist with :playlistid
exports.deleteSongFromPlaylist = (req, res) => {};
