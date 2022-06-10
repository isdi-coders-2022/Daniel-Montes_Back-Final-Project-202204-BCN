require("dotenv").config();
const express = require("express");

const {
  getPenguins,
  deletePenguin,
  createPenguin,
  getFavsPenguins,
} = require("../../../controllers/penguinControllers/penguinControllers");

const penguinRouters = express.Router();

penguinRouters.get("/", getPenguins);
penguinRouters.get("/penguins", getPenguins);
penguinRouters.get("/favs", getFavsPenguins);
penguinRouters.delete("/:idPenguin", deletePenguin);
penguinRouters.post("/create", createPenguin);

module.exports = penguinRouters;
