const debug = require("debug")("Penguin:customError");

const customError = (statusCode, customMessage, originalMessage = "") => {
  const error = new Error(originalMessage);
  error.statusCode = statusCode;
  error.customMessage = customMessage;
  error.originalMessage = originalMessage;
  debug(`ERROR: ${customMessage}`);

  return error;
};

module.exports = { customError };
