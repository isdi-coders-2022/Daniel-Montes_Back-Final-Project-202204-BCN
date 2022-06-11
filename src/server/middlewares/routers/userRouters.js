require("dotenv").config();
const express = require("express");
const { validate } = require("express-validation");

const {
  userRegister,
  userLogin,
} = require("../../controllers/userControllers");

const {
  userLoginSchema,
  userRegisterSchema,
} = require("../../schemas/userSchema");

const usersRouters = express.Router();

usersRouters.post("/login", validate(userLoginSchema), userLogin);
usersRouters.post("/register", validate(userRegisterSchema), userRegister);

module.exports = usersRouters;
