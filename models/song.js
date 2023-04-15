module.exports = (sequelize, DataTypes) => {
  const Song = sequelize.define("song", {
    songId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true,
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
      type: DataTypes.TINYINT,
      allowNull: false,
    },

    year: {
      type: DataTypes.TINYINT,
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
