const express = require("express");
const { validate } = require("express-validation");
const debug = require("debug")("AAP:URouters");
const chalk = require("chalk");
const {
  userRegister,
  userLogin,
  getUser,
} = require("../../../controllers/userControllers/userControllers");

const {
  userLoginSchema,
  userRegisterSchema,
} = require("../../../schemas/userSchema");

const logPrefix = "User Request-->";

const usersRouters = express.Router();

const beforeLogin = () => {
  try {
    debug(chalk.green(`${logPrefix} LOGIN: Validating user schema`));
    return validate(userLoginSchema);
  } catch (error) {
    debug(chalk.red(`${logPrefix} LOGIN: ERROR Validating user schema`));
    return validate(userLoginSchema);
  }
};

const beforeRegister = () => {
  try {
    debug(chalk.green(`${logPrefix} REGISTER: Validating user schema`));
    return validate(userRegisterSchema);
  } catch (error) {
    debug(chalk.red(`${logPrefix} REGISTER: ERROR Validating user schema`));
    return validate(userRegisterSchema);
  }
};

usersRouters.post("/login", beforeLogin(), userLogin);
usersRouters.post("/register", beforeRegister(), userRegister);
usersRouters.get("/:UserId", getUser);
usersRouters.get("/edit/:UserId", getUser);

module.exports = usersRouters;
