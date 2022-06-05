require("dotenv").config();
const express = require("express");
const { validate } = require("express-validation");

const {
  loginUser,
} = require("../../../controllers/userControllers/userControllers");
const { userLoginSchema } = require("../../../schemas/userSchema");

const userRouters = express.Router();

userRouters.post("/users/login", validate(userLoginSchema), loginUser);

module.exports = userRouters;
