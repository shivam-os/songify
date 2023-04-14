const express = require("express");
const app = express();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const passport = require("passport");
require("./config/db");
const PORT = 3005;
require("./config/passport")(passport);
const userRoutes = require("./routes/userRoutes");
const playlistsRoutes = require("./routes/playlistsRoutes");
const songRoutes = require("./routes/songsRoutes")

//Required middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

//App routes
app.use("/api/user", userRoutes);
app.use("/api/playlists", playlistsRoutes);
app.use("/api/songs", songRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
})
