const debug = require("debug")("penguin:penguinControllers");
const chalk = require("chalk");
const Penguin = require("../../../db/models/Penguin/Penguin");
const User = require("../../../db/models/User/User");

const getPenguin = async (req, res) => {
  const { idPenguin } = req.params;
  const penguin = await Penguin.findById(idPenguin);

  res.status(200).json({ penguin });
};

const getPenguins = async (req, res, next) => {
  try {
    const penguins = await Penguin.find();

    debug(chalk.green(`Loading full list of Penguins...`));
    debug(chalk.green(`Total found: ${penguins.length}.`));

    res.status(200).json({ penguins });
  } catch (err) {
    err.message = "Error getting all the penguins";
    err.code = 404;

    next(err);
  }
};

const getFavsPenguins = async (req, res, next) => {
  const { userId } = req;
  try {
    const { username } = await User.findOne({ id: userId });
    const penguins = await Penguin.find({ owner: username });

    debug(chalk.green(`User ${username} asked for Favs list...`));
    debug(chalk.green(`Total found: ${penguins.length}.`));
    res.status(200).json({ penguins });
  } catch (error) {
    error.code = 404;
    error.customMessage = "Penguins not found";

    next(error);
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

const editPenguin = async (req, res) => {
  const { idPenguin } = req.params;
  const { name, likes, description, category } = req.body;
  const { img, imgBackup } = req;

  try {
    const penguinToEdit = await Penguin.findById(idPenguin);
    const penguinEdited = {
      name,
      likes,
      description,
      category,
      image: img,
      imageBackup: imgBackup,
      owner: penguinToEdit.owner,
    };
    const newPenguin = await Penguin.findByIdAndUpdate(
      idPenguin,
      penguinEdited,
      {
        new: true,
      }
    );
    res.status(200).json(newPenguin);
  } catch (error) {
    error.customMessage = "Penguin not found";
    error.code = 400;
  }
};

module.exports = {
  getPenguin,
  getPenguins,
  deletePenguin,
  createPenguin,
  getFavsPenguins,
  editPenguin,
};
