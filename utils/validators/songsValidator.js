const { body } = require("express-validator");

exports.checkSongId = [
  body("songId")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Song id field cannot be empty!")
    .isLength({ min: 2, max: 50 })
    .withMessage(
      "Song id field must contain minimum 3 letters and maximum 100 letters!"
    ),
];
