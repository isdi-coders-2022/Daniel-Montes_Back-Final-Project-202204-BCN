require("dotenv").config();
const express = require("express");
const { validate } = require("../../../../db/models/User/User");
const { penguinSchema } = require("../../../schemas/penguinSchema");
const {
  getPenguins,
  deletePenguin,
} = require("../../../controllers/penguinControllers/penguinControllers");

const penguinRouters = express.Router();

penguinRouters.get("/penguins", validate(penguinSchema), getPenguins);
penguinRouters.delete("/delete", validate(penguinSchema), deletePenguin);

module.exports = { penguinRouters };
