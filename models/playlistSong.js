module.exports = (sequelize, DataTypes) => {
  const PlaylistSong = sequelize.define("playlist_songs", {
    playlistId: {
      type: DataTypes.INTEGER,
    },

    songId: {
      type: DataTypes.INTEGER,
    },
  });

  return PlaylistSong;
};
