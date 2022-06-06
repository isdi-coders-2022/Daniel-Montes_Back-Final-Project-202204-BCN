require("dotenv").config();
const express = require("express");

const {
  getPenguins,
  deletePenguin,
} = require("../../../controllers/penguinControllers/penguinControllers");

const penguinRouters = express.Router();

penguinRouters.get("/penguins", getPenguins);
penguinRouters.delete("/delete", deletePenguin);

module.exports = penguinRouters;
