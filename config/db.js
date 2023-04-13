const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

//Create connection to database
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
  }
);

//Test the connection to database
const testDBconnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to database successfully.");
  } catch (err) {
    console.log("Error while connecting to database:", err);
  }
};
testDBconnection();

const db = {
  sequelize: sequelize,
  Sequelize: Sequelize,
};

//Sync all the tables with the database
const syncAllTables = async () => {
  try {
    await db.sequelize.sync();
    console.log("Synced all the tables with the database successfully.");
  } catch (err) {
    console.log("Error in syncing the tables with database:", err);
  }
};
syncAllTables();

//Register models the the db object
db.user = require("../models/user")(sequelize, DataTypes);
db.playlist = require("../models/playlist")(sequelize, DataTypes);
db.song = require("../models/song")(sequelize, DataTypes);
db.playlistSong = require("../models/playlistSong")(sequelize, DataTypes);
db.userFriend = require("../models/userFriend")(sequelize, DataTypes);

//Define associations between the tables
db.user.hasMany(db.playlist, { foreignKey: "userId" });
db.user.belongsToMany(db.user, {as: "user",
  through: db.userFriend, foreignKey: "userId"
});
db.user.belongsToMany(db.user, {as: "friend",
  through: db.userFriend, foreignKey: "friendId"
});
// db.playlist.belongsToMany(db.song, {
//   through: "playlist_songs",
//   foreignKey: "playlistId",
// });
// db.song.belongsToMany(db.playlist, {
//   through: "playlist_songs",
//   foreignKey: "songId",
// });

module.exports = db;
