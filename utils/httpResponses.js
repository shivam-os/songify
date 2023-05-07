const { validationResult } = require("express-validator");

//CREATE (POST) object - 201
exports.createdResponse = (res, object) => {
  res.status(201).json({ msg: `${object} created successfully!` });
};

//UPDATE (PUT) object - 200
exports.updatedResponse = (res, object) => {
  res
    .status(200)
    .json({ msg: `${object} with given id updated successfully!` });
};

//DELETE (DELETE) object - 200
exports.deletedResponse = (res, object) => {
  res
    .status(200)
    .json({ msg: `${object} with given id deleted successfully!` });
};

//---------------------------- Errors ----------------------------------

//Handle validation errors - 400
exports.validationError = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
};

//Already exists error - 400
exports.existsError = (res, object) => {
  res
    .status(400)
    .json({ err: `${object} already exists. Recheck and try again!` });
};

//Not found error - 404
exports.notFoundError = (res, object) => {
  res.status(404).json({
    err: `${object} with given id does not exist. Recheck and try again!`,
  });
};

//Internal server error - 500
exports.serverError = (res) => {
  res
    .status(500)
    .json({ err: "Something has went wrong. Please try again later." });
};
