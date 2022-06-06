const debug = require("debug")("penguin:penguinControllers");
const chalk = require("chalk");
const Penguin = require("../../../db/models/Penguin/Penguin");

const getPenguins = async (req, res, next) => {
  try {
    const penguins = await Penguin.find();
    debug(chalk.green("Someone asked for all the penguins"));

    res.status(200).json({ penguins });
  } catch (err) {
    err.message = "Error getting all the penguins";
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
module.exports = { getPenguins, deletePenguin };
