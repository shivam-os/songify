const axios = require("axios");
require("dotenv").config();

module.exports = axios.create({
  baseURL: process.env.SERVER_URL
})
