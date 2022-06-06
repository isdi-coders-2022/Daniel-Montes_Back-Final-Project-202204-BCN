require("dotenv").config();
const express = require("express");

const {
  getPenguins,
  deletePenguin,
  createPenguin,
} = require("../../../controllers/penguinControllers/penguinControllers");

const penguinRouters = express.Router();

penguinRouters.get("/", getPenguins);
penguinRouters.get("/penguins", getPenguins);
penguinRouters.delete("/:idPenguin", deletePenguin);
penguinRouters.post("/", createPenguin);

module.exports = penguinRouters;
