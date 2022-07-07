const express = require("express");
const { validate } = require("express-validation");
const chalk = require("chalk");
const debug = require("debug")(chalk.white("AAP:URouters"));

const {
  userRegister,
  userLogin,
  getUser,
} = require("../../../controllers/userControllers/userControllers");

const {
  userLoginSchema,
  userRegisterSchema,
} = require("../../../schemas/userSchema");

const logPrefix = chalk.cyan("User Request-->");

const usersRouters = express.Router();

const beforeLogin = () => {
  try {
    const result = validate(userLoginSchema);

    debug(
      `${logPrefix}${chalk.white(` LOGIN: `)}${chalk.green(
        `User schema validated successfully.`
      )}`
    );
    return result;
  } catch (error) {
    debug(`${logPrefix}${chalk.red(` LOGIN: ERROR Validating user schema.`)}`);

    return error;
  }
};

const beforeRegister = () => {
  try {
    const result = validate(userRegisterSchema);

    debug(
      `${logPrefix}${chalk.white(` REGISTER: `)}${chalk.green(
        `User schema validated successfully.`
      )}`
    );
    return result;
  } catch (error) {
    debug(
      `${logPrefix}${chalk.white(` REGISTER: `)}${chalk.red(
        `ERROR Validating user schema.`
      )}`
    );
    return error;
  }
};

usersRouters.post("/register", beforeRegister(), userRegister);
usersRouters.post("/login", beforeLogin(), userLogin);

usersRouters.get("/:UserId", getUser);
usersRouters.get("/edit/:UserId", getUser);

module.exports = usersRouters;
