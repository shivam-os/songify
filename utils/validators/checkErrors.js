const { validationResult } = require("express-validator");

//Handle errors coming from respective validators
module.exports = (req, res) => {
  const errors = validationResult(req, res);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
};
