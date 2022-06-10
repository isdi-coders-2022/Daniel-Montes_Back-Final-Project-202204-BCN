const debug = require("debug")("penguin:penguinControllers");
const chalk = require("chalk");
const Penguin = require("../../../db/models/Penguin/Penguin");

const getPenguin = async (req, res) => {
  const { idPenguin } = req.params;
  const penguin = await Penguin.findById(idPenguin);

  res.status(200).json({ penguin });
};

const getPenguins = async (req, res, next) => {
  try {
    const penguins = await Penguin.find();
    debug(chalk.green("Penguins loading..."));

    res.status(200).json({ penguins });
  } catch (err) {
    err.message = "Error getting all the penguins";
    err.code = 404;

    next(err);
  }
};

const getFavsPenguins = async (req, res, next) => {
  try {
    const penguins = await Penguin.find();
    debug(chalk.green("Favs penguins loading..."));

    res.status(200).json({ penguins });
  } catch (err) {
    err.message = "Error getting favs penguins";
    err.code = 404;

    next(err);
  }
};

const deletePenguin = async (req, res, next) => {
  const { idPenguin } = req.params;

  try {
    await Penguin.findByIdAndDelete(idPenguin);

    res.status(200).json({ msg: "Penguin deleted" });
    debug(chalk.green("Penguin deleted"));
  } catch (err) {
    debug(chalk.red("Penguin id not found"));
    err.message = "Penguin id not found";
    err.code = 404;

    next(err);
  }
};

const createPenguin = async (req, res) => {
  debug(chalk.green("received request to create a penguin..."));
  const penguin = req.body;
  const newPenguin = await Penguin.create(penguin);

  res.status(201).json(newPenguin);
};

module.exports = {
  getPenguin,
  getPenguins,
  deletePenguin,
  createPenguin,
  getFavsPenguins,
};
