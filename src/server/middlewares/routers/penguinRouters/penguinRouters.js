require("dotenv").config();
const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  getPenguins,
  deletePenguin,
  createPenguin,
  getFavsPenguins,
  getPenguin,
  editPenguin,
  searchPenguins,
} = require("../../../controllers/penguinControllers/penguinControllers");

const firebaseUploads = require("../../firebase/firebaseUploads");

const penguinRouters = express.Router();

const upload = multer({
  dest: path.join("uploads", "images"),
  limits: {
    fieldSize: 8000000,
  },
});

penguinRouters.post(
  "/create",
  upload.single("image"),
  firebaseUploads,
  createPenguin
);

penguinRouters.get("/", getPenguins);
penguinRouters.delete("/:idPenguin", deletePenguin);
penguinRouters.get("/favs", getFavsPenguins);
penguinRouters.get("/:idPenguin", getPenguin);
penguinRouters.get("/search/:text", searchPenguins);
penguinRouters.put("/:idPenguin", editPenguin);

module.exports = penguinRouters;
