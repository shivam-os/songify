module.exports = (sequelize, DataTypes) => {
  const Song = sequelize.define("song", {
    songId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },

    externalSongId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    artistName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    Album: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Song;
};
