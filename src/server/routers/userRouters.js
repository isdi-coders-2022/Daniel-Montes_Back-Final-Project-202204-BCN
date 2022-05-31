require("dotenv").config();
const express = require("express");
const { validate } = require("express-validation");
const { loginUser } = require("../controllers/userControllers");
const { userLoginSchema } = require("../schemas/userSchema");

const usersRouters = express.Router();

usersRouters.post("/login", validate(userLoginSchema), loginUser);

module.exports = usersRouters;
