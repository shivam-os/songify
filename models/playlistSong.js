module.exports = (sequelize, DataTypes) => {
  const PlaylistSong = sequelize.define("playlist_songs", {
    playlistId: {
      type: DataTypes.STRING,
    },

    songId: {
      type: DataTypes.DATE,
    },
  });

  return PlaylistSong;
};
