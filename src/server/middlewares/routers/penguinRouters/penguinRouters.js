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
} = require("../../../controllers/penguinControllers/penguinControllers");

const firebaseUploads = require("../../firebase/firebase");

const penguinRouters = express.Router();

const upload = multer({
  dest: path.join("uploads", "images"),
  limits: {
    fieldSize: 8000000,
  },
});

penguinRouters.get("/", getPenguins);
penguinRouters.get("/favs", getFavsPenguins);
penguinRouters.delete("/:idPenguin", deletePenguin);

penguinRouters.post(
  "/create",
  upload.single("image"),
  firebaseUploads,
  createPenguin
);
penguinRouters.get("/:idPenguin", getPenguin);
penguinRouters.put("/:idPenguin", editPenguin);

module.exports = penguinRouters;
