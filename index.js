const express = require("express");
const app = express();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const passport = require("passport");
require("dotenv").config();
require("./config/db");
require("./config/passport")(passport);
const userRoutes = require("./routes/userRoutes");
const playlistsRoutes = require("./routes/playlistsRoutes");
const songRoutes = require("./routes/songsRoutes");
const { swaggerServe, swaggerSetup } = require("./config/swagger");

//Required middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

//App routes
app.use("/api/users", userRoutes);
app.use("/api/playlists", playlistsRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/docs", swaggerServe, swaggerSetup);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port: ${process.env.PORT}`);
});
