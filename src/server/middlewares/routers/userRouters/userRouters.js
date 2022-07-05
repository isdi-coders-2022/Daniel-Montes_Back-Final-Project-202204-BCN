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
    const result = validate(userLoginSchema);
    return result;
  } catch (error) {
    debug(chalk.red(`${logPrefix} LOGIN: ERROR Validating user schema`));
    const result = validate(userLoginSchema);
    return result;
  }
};

const beforeRegister = () => {
  try {
    debug(chalk.green(`${logPrefix} REGISTER: Validating user schema`));
    const result = validate(userRegisterSchema);
    return result;
  } catch (error) {
    debug(chalk.red(`${logPrefix} REGISTER: ERROR Validating user schema`));
    const result = validate(userRegisterSchema);
    return result;
  }
};

usersRouters.post("/login", beforeLogin(userLogin), userLogin);
usersRouters.post("/register", beforeRegister(userRegister), userRegister);
usersRouters.get("/:UserId", getUser);
usersRouters.get("/edit/:UserId", getUser);

module.exports = usersRouters;
