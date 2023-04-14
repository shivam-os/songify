module.exports = (sequelize, DataTypes) => {
  const Song = sequelize.define("song", {
    songId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },

    externalSongId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    album: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    duration: {
      type: DataTypes.SMALLINT,
      allowNull: false,
    },

    year: {
      type: DataTypes.SMALLINT,
      allowNull: false,
    },

    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    primaryArtists: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Song;
};
