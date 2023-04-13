const express = require("express");
const app = express();
const morgan = require("morgan");
const PORT = 3005;
const userRoutes = require("./routes/userRoutes");
const passport = require(passport);
require("./config/db")

//Required middlewares
app.use(express.json());
app.use(morgan("dev"));

//App routes
app.use("/api/user", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
})
