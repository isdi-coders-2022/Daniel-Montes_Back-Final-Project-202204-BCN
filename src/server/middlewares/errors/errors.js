require("dotenv").config();
const chalk = require("chalk");
const debug = require("debug")("AAP:Errors");
const { ValidationError } = require("express-validation");

const { customError } = require("../../utils/customError");

const notFoundError = (req, res, next) => {
  const error = customError(404, `Page not found:  ${req.originalUrl}`);

  next(error);
};

// eslint-disable-next-line no-unused-vars
const generalError = (err, req, res, next) => {
  const errorCode = err.code ?? 500;
  const errorMessage = err.code ? err.message : "Internal server error";

  if (err instanceof ValidationError) {
    debug(
      chalk.red(
        `ERROR: (${err.statusCode}) ${err.message} ${ValidationError.details}`
      )
    );
    res.status(400).json({ message: "Validation error" });
  } else {
    debug(chalk.red(`ERROR: ${err.message}`));
    res.status(errorCode).json({ message: errorMessage });
  }
};

module.exports = {
  notFoundError,
  generalError,
};
