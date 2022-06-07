require("dotenv").config();
const chalk = require("chalk");
const debug = require("debug")(chalk.red("penguin:MW:errors"));

const { customError } = require("../../utils/customError");

const notFoundError = (req, res, next) => {
  const error = customError(404, "Page not found");

  next(error);
};

// eslint-disable-next-line no-unused-vars
const generalError = (error, req, res, next) => {
  debug(
    chalk.yellow(`ERROR: ${error.message} (statusCode: ${error.statusCode})`)
  );

  const message = error.customMessage ?? error.message;
  const statusCode = error.statusCode ?? 500;
  chalk.red(`${message}  ${statusCode}`);
  res.status(statusCode).json({ error: true, message });
};

module.exports = {
  notFoundError,
  generalError,
};
