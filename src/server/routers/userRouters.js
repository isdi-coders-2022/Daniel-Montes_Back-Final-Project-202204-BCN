require("dotenv").config();
const express = require("express");
const { validate } = require("express-validation");
const { loginUser, registerUser } = require("../controllers/userControllers");
const {
  credentialsLoginSchema,
  credentialsRegisterSchema,
} = require("../schemas/userCredentialsSchema");

const usersRouter = express.Router();

usersRouter.post("/login", validate(credentialsLoginSchema), loginUser);
usersRouter.post(
  "/register",
  validate(credentialsRegisterSchema),
  registerUser
);

module.exports = usersRouter;
