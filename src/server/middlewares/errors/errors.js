require("dotenv").config();
const chalk = require("chalk");
const debug = require("debug")(
  chalk.yellow("penguin:server:middlewares:errors")
);

const { customError } = require("../../utils/customError");

const notFoundError = (req, res, next) => {
  const error = customError(404, chalk.white("Page not found"));

  next(error);
};

// eslint-disable-next-line no-unused-vars
const generalError = (error, req, res, next) => {
  debug(chalk.red(error.message || error.customMessage));
  const message = error.customMessage ?? "General error";
  const statusCode = error.statusCode ?? 500;

  res.status(statusCode).json({ error: true, message });
};

module.exports = {
  notFoundError,
  generalError,
};
