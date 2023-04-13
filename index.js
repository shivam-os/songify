const express = require("express");
const app = express();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const passport = require("passport");
require("./config/db");
const PORT = 3005;
const userRoutes = require("./routes/userRoutes");
require("./config/passport")(passport);
const playlistsRoutes = require("./routes/playlistsRoutes");

//Required middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

//App routes
app.use("/api/user", userRoutes);
app.use("/api/playlists", playlistsRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
})
