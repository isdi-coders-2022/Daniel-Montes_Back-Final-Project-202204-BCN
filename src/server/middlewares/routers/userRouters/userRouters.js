const express = require("express");
const { validate } = require("express-validation");
const chalk = require("chalk");
const debug = require("debug")(chalk.blue("AAP:URouters"));

const {
  userRegister,
  userLogin,

  userGet,
  userEdit,
} = require("../../../controllers/userControllers/userControllers");

const {
  userLoginSchema,
  userRegisterSchema,
} = require("../../../schemas/userSchema");

const logPrefix = chalk.white("User Request-->");

const usersRouters = express.Router();

const beforeLogin = () => {
  try {
    const result = validate(userLoginSchema);

    debug(
      `${logPrefix}${chalk.blue(` LOGIN: `)}${chalk.green(
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
      `${logPrefix}${chalk.blue(` REGISTER: `)}${chalk.green(
        `User schema validated successfully.`
      )}`
    );
    return result;
  } catch (error) {
    debug(
      `${logPrefix}${chalk.blue(` REGISTER: `)}${chalk.red(
        `ERROR Validating user schema.`
      )}`
    );
    return error;
  }
};

usersRouters.post("/register", beforeRegister(), userRegister);
usersRouters.post("/login", beforeLogin(), userLogin);

usersRouters.get("/:UserId", userGet);
usersRouters.put("/edit/:UserId", userEdit);

module.exports = usersRouters;
