const {body} = require("express-validator");

exports.createPlaylist = [
  body("name")
  .trim()
  .not()
  .isEmpty()
  .withMessage("Name field cannot be empty!")
  .isLength({ min: 3, max: 100 })
  .withMessage(
    "Name field must contain minimum 3 letters and maximum 100 letters!"
  )
]
