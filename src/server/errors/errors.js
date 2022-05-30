require("dotenv").config();
const chalk = require("chalk");
const debug = require("debug")(chalk.rgb(255, 42, 0)("Penguin:ERROR"));

require("debug");

const notFoundError = (req, res) => {
  debug(chalk.rgb(255, 42, 0)("Page Not Found"));
  res.status(404).json({ msg: "Page Not Found" });
};

// eslint-disable-next-line no-unused-vars
const generalError = (error, req, res, next) => {
  const statusCode = error.statusCode ?? 500;
  debug(chalk.rgb(255, 42, 0)(error.message));
  const errorMessage = error.customMessage ?? "General error";

  res.status(statusCode).json(errorMessage);
};

module.exports = { notFoundError, generalError };
