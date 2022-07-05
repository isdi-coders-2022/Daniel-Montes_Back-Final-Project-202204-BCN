const debug = require("debug")("AAP:PControllers");
const chalk = require("chalk");
const jwt = require("jsonwebtoken");
const Penguin = require("../../../db/models/Penguin/Penguin");

const logPrefix = "User Request-->";

const getPenguin = async (req, res, next) => {
  try {
    const { idPenguin } = req.params;
    debug(
      chalk.green(`${logPrefix} GET Detail: Penguin id: ${String(idPenguin)}`)
    );
    const penguin = await Penguin.findById(idPenguin);

    debug(chalk.green(`${logPrefix} GET Detail: Found: ${penguin.name}`));
    debug(chalk.green(`${logPrefix} GET Detail: Finished successfully.`));
    res.status(200).json(penguin);
  } catch (err) {
    err.message = `GET Detail: Penguin id: ${req.params.idPenguin}`;
    err.code = 404;

    next(err);
  }
};

const getPenguins = async (req, res, next) => {
  try {
    debug(chalk.green(`${logPrefix} GET: Penguins...`));
    const penguins = await Penguin.find();
    debug(
      chalk.green(
        `${logPrefix} GET: Total found: ${penguins.length} cute penguins.`
      )
    );
    debug(chalk.green(`${logPrefix} GET: Finished successfully.`));
    res.status(200).json({ penguins });
  } catch (err) {
    err.message =
      "User Request--> : getting all penguins for user: ${req.params.user";
    err.code = 404;
    debug(chalk.red(`${logPrefix} ERROR: ${err.message}`));
    next(err);
  }
};

const getFavsPenguins = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const token = authorization.replace("Bearer ", "");
    const { username, id } = jwt.verify(token, process.env.JWT_SECRET);
    debug(chalk.green(`${logPrefix} GET Favs: Username: ${username}.`));

    const penguins = await Penguin.find({ favs: id });

    debug(
      chalk.green(`${logPrefix} GET Favs: Total found: ${penguins.length}.`)
    );

    debug(chalk.green(`${logPrefix} GET Favs: Finished successfully.`));
    res.status(200).json({ penguins });
  } catch (err) {
    err.message = "getFavsPenguins() getting all penguins";
    err.code = 404;

    next(err);
  }
};

const deletePenguin = async (req, res, next) => {
  debug(chalk.green(`${logPrefix} DELETE Penguin name: ${req.body.name}`));

  try {
    const { idPenguin } = req.params;
    await Penguin.findByIdAndDelete(idPenguin);

    debug(
      chalk.green(
        `${logPrefix} DELETED Penguin id: ${idPenguin}  successfully.`
      )
    );
    res.status(200).json({ msg: "Penguin deleted" });
  } catch (err) {
    debug(chalk.red(`${logPrefix} DELETE Error: Penguin id not found`));
    err.message = "Penguin id not found";
    err.code = 404;

    next(err);
  }
};

const createPenguin = async (req, res) => {
  debug(chalk.green(`${logPrefix} CREATE: Name: ${req.body.name}`));
  const { penguin } = req.body;
  try {
    const newPenguin = await Penguin.create({ penguin });

    debug(
      chalk.green(`${logPrefix} CREATE: ${newPenguin.name} added successfully`)
    );
    res.status(201).json(newPenguin);
  } catch (err) {
    debug(
      chalk.red(
        `${logPrefix} CREATE: Error saving new penguin: ${req.body.name} ${penguin} )`
      )
    );

    debug(
      chalk.red(`${logPrefix} CREATE: ERROR-> ${err} (err.code: ${err.code})`)
    );
    err.message = `${logPrefix} CREATE: ERROR-> ${err} (err.code: ${err.code})`;
    err.code = 404;
  }
};

const editPenguin = async (req, res, next) => {
  const type = req.query.task;

  try {
    const { idPenguin } = req.params;
    const penguinEdited = {
      name: req.body.name,
      category: req.body.category,
      likes: req.body.likes,
      likers: req.body.likers,
      favs: req.body.favs,
      image: req.body.image,
      imageBackup: req.body.imageBackup || "",
      description: req.body.description,
    };

    debug(chalk.green(`${logPrefix} UPDATE: ${penguinEdited.name}`));

    await Penguin.findByIdAndUpdate(idPenguin, penguinEdited, {
      new: true,
    }).catch((error) => {
      debug(
        chalk.red(
          `${logPrefix} UPDATE: ${type}. ERROR ${`${penguinEdited.name}`}. Error: ${
            error.message
          }`
        )
      );
    });
    debug(chalk.green(`${logPrefix} UPDATE: ${type}, finished successfully.`));
    res.status(200).json(penguinEdited);
  } catch (error) {
    debug(
      chalk.red(
        `${logPrefix} CREATE: ERROR-> ${error} (err.code: ${error.code})`
      )
    );
    error.customMessage = `${logPrefix} UPDATE: ${type}.  ERROR Penguin not found`;
    error.code = 400;

    next(error);
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
