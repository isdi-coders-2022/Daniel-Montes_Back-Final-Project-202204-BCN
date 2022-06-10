require("dotenv").config();
const express = require("express");
const { validate } = require("express-validation");

const {
  userRegister,
  userLogin,
} = require("../../controllers/userControllers");

const { userLoginSchema } = require("../../schemas/userSchema");

const usersRouters = express.Router();

usersRouters.post("/users/login", validate(userLoginSchema), userLogin);
usersRouters.post("/register", validate(userLoginSchema));

module.exports = usersRouters;
