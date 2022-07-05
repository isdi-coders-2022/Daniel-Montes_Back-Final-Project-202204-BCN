const debug = require("debug")("AAP:PControllers");
const chalk = require("chalk");
const jwt = require("jsonwebtoken");
const Penguin = require("../../../db/models/Penguin/Penguin");

const logPrefix = "User Request--> ";
const logPrefixDetail = `${logPrefix}GET Detail: `;
const logPrefixGet = `${logPrefix}GET: `;
const logPrefixDelete = `${logPrefix}DELETE: `;
const logPrefixgetFavs = `${logPrefix}GET favs: `;
const logPrefixgetCreate = `${logPrefix}CRETE: `;
const logPrefixgetEdit = `${logPrefix}EDIT: `;

const getPenguin = async (req, res, next) => {
  try {
    const { idPenguin } = req.params;
    debug(chalk.green(`${logPrefixDetail}Penguin id: ${String(idPenguin)}`));
    const penguin = await Penguin.findById(idPenguin);

    debug(chalk.green(`${logPrefixDetail}Found: ${penguin.name}`));
    debug(chalk.green(`${logPrefixDetail}Finished successfully.`));
    res.status(200).json(penguin);
  } catch (err) {
    err.message = `${logPrefix}Penguin id: ${req.params.idPenguin}`;
    err.code = 404;

    next(err);
  }
};

const getPenguins = async (req, res, next) => {
  try {
    debug(chalk.green(`${logPrefixGet}Penguins...`));
    const penguins = await Penguin.find();
    debug(
      chalk.green(
        `${logPrefixGet}Total found: ${penguins.length} cute penguins.`
      )
    );
    debug(chalk.green(`${logPrefixGet}Finished successfully.`));
    res.status(200).json({ penguins });
  } catch (err) {
    err.message = `${logPrefixGet}Getting all penguins for user: ${req.params.user}`;
    err.code = 404;
    debug(chalk.red(`${logPrefixGet}ERROR: ${err.message}`));
    next(err);
  }
};

const getFavsPenguins = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const token = authorization.replace("Bearer ", "");
    const { username, id } = jwt.verify(token, process.env.JWT_SECRET);
    debug(chalk.green(`${logPrefixgetFavs}Username: ${username}.`));

    const penguins = await Penguin.find({ favs: id });

    debug(chalk.green(`${logPrefixgetFavs}Total found: ${penguins.length}.`));

    debug(chalk.green(`${logPrefixgetFavs}Finished successfully.`));
    res.status(200).json({ penguins });
  } catch (err) {
    err.message = `${logPrefixgetFavs} getFavsPenguins() getting all penguins`;
    err.code = 404;

    next(err);
  }
};

const deletePenguin = async (req, res, next) => {
  debug(chalk.green(`${logPrefixDelete}Penguin name: ${req.body.name}`));

  try {
    const { idPenguin } = req.params;
    await Penguin.findByIdAndDelete(idPenguin);

    debug(
      chalk.green(`${logPrefixDelete}Penguin id: ${idPenguin}  successfully.`)
    );
    res.status(200).json({ msg: "Penguin deleted" });
  } catch (err) {
    debug(chalk.red(`${logPrefixDelete}Error: Penguin id not found`));
    err.message = `${logPrefixDelete}Penguin id not found`;
    err.code = 404;

    next(err);
  }
};

const createPenguin = async (req, res) => {
  debug(chalk.green(`${logPrefixgetCreate}Name: ${req.body.name}`));
  const { penguin } = req.body;
  try {
    const newPenguin = await Penguin.create({ penguin });

    debug(
      chalk.green(`${logPrefixgetCreate}${newPenguin.name} added successfully`)
    );
    res.status(201).json(newPenguin);
  } catch (err) {
    debug(
      chalk.red(
        `${logPrefixgetCreate}Error saving new penguin: ${req.body.name} ${penguin} )`
      )
    );

    debug(
      chalk.red(`${logPrefixgetCreate}ERROR-> ${err} (err.code: ${err.code})`)
    );
    err.message = `${logPrefixgetCreate}ERROR-> ${err} (err.code: ${err.code})`;
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

    debug(chalk.green(`${logPrefixgetEdit}${penguinEdited.name}`));

    await Penguin.findByIdAndUpdate(idPenguin, penguinEdited, {
      new: true,
    }).catch((error) => {
      const message = `${logPrefixgetEdit}${type}. ERROR ${`${penguinEdited.name}`}. Error: ${
        error.message
      }`;
      debug(chalk.red(message));
    });
    debug(chalk.green(`${logPrefix} UPDATE: ${type}, finished successfully.`));
    res.status(200).json(penguinEdited);
  } catch (error) {
    debug(
      chalk.red(`${logPrefixgetEdit}ERROR-> ${error} (err.code: ${error.code})`)
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
