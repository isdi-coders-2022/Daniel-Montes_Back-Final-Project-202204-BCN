const chalk = require("chalk");
const debug = require("debug")(chalk.blue("AAP:CustomError"));

const logPrefix = chalk.white("User Request-->");

const customError = (statusCode, customMessage, originalMessage = "") => {
  const error = new Error(originalMessage);
  error.statusCode = statusCode;
  error.customMessage = customMessage;
  error.originalMessage = originalMessage;
  debug(chalk.red(`${logPrefix} ERROR: ${customMessage}`));

  return error;
};

module.exports = { customError };
