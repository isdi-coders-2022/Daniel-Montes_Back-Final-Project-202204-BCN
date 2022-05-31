require("dotenv").config();
const express = require("express");
const { validate } = require("express-validation");
const { loginUser, registerUser } = require("../controllers/userControllers");
const {
  userLoginSchema,
  userRegisterSchema,
} = require("../schemas/userSchema");

const usersRouters = express.Router();

usersRouters.post("/login", validate(userLoginSchema), loginUser);
usersRouters.post("/register", validate(userRegisterSchema), registerUser);

module.exports = usersRouters;
