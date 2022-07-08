const chalk = require("chalk");
const debug = require("debug")(chalk.blue("AAP:PControllers"));

const jwt = require("jsonwebtoken");
const Penguin = require("../../../db/models/Penguin/Penguin");

const logPrefix = chalk.white("User Request-->");
const logPrefixDetail = `${logPrefix}${chalk.blue(`GET Detail: `)}`;
const logPrefixGet = `${logPrefix}${chalk.blue(`GET: `)}`;
const logPrefixDelete = `${logPrefix}${chalk.blue(`DELETE: `)}`;
const logPrefixgetFavs = `${logPrefix}${chalk.blue(`GET favs: `)}`;
const logPrefixgetCreate = `${logPrefix}${chalk.blue(`CREATE: `)}`;
const logPrefixgetEdit = `${logPrefix}${chalk.blue(`UPDATE: `)}`;

let message = "";

const getPenguin = async (req, res, next) => {
  try {
    const { idPenguin } = req.params;
    message = chalk.green(`${logPrefixDetail}Penguin id: ${String(idPenguin)}`);
    debug(message);

    const penguin = await Penguin.findById(idPenguin);
    message = chalk.green(`${logPrefixDetail}Found: ${penguin.name}`);
    debug(message);

    message = chalk.green(`${logPrefixDetail}Finished successfully.`);
    debug(message);

    res.status(200).json(penguin);
  } catch (err) {
    err.message = `${logPrefix}Penguin id: ${req.params.idPenguin}`;
    err.code = 404;

    next(err);
  }
};

const getPenguins = async (req, res, next) => {
  try {
    message = chalk.green(`${logPrefixGet}Penguins...`);
    debug(message);

    const penguins = await Penguin.find();
    message = chalk.green(
      `${logPrefixGet}Total found: ${penguins.length} cute penguins.`
    );
    debug(message);

    message = chalk.green(`${logPrefixGet}Finished successfully.`);
    debug(message);

    res.status(200).json({ penguins });
  } catch (err) {
    err.message = `${logPrefixGet}Getting all penguins for user: ${req.params.user}`;
    err.code = 404;

    message = chalk.red(`${logPrefixGet}ERROR: ${err.message}`);
    debug(message);

    next(err);
  }
};

const getFavsPenguins = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const token = authorization.replace("Bearer ", "");
    const { username, id } = jwt.verify(token, process.env.JWT_SECRET);

    message = chalk.green(`${logPrefixgetFavs}Username: ${username}.`);
    debug(message);

    const penguins = await Penguin.find({ favs: id });

    message = chalk.green(
      `${logPrefixgetFavs}Total found: ${penguins.length}.`
    );
    debug(message);

    message = chalk.green(`${logPrefixgetFavs}Finished successfully.`);
    debug(message);

    res.status(200).json({ penguins });
  } catch (err) {
    err.message = `${logPrefixgetFavs} getFavsPenguins() getting all penguins`;
    err.code = 404;

    next(err);
  }
};

const deletePenguin = async (req, res, next) => {
  const { idPenguin } = req.params;
  message = chalk.green(`${logPrefixDelete}id: ${idPenguin}`);
  debug(message);

  try {
    await Penguin.findByIdAndDelete(idPenguin);

    message = chalk.green(`${logPrefixDelete}id: ${idPenguin} successfully.`);
    debug(message);

    res.status(200).json({ msg: "Penguin deleted" });
  } catch (err) {
    message = chalk.red(`${logPrefixDelete}ERROR: Penguin id not found`);
    debug(message);

    err.message = `${logPrefixDelete}Penguin id not found`;
    err.code = 404;

    next(err);
  }
};

const createPenguin = async (req, res, next) => {
  const { name, img, imgBackup, category, likers, favs, description } =
    req.body;

  message = chalk.green(`${logPrefixgetCreate}Name: ${name}`)`);
  debug(message);

  try {
    const user = await Penguin.findOne({ name });
    if (user) {
      const err = new Error();
      err.code = 409;
      err.message = "This name already exists";
      next(err);

      return;
    }

    const newPenguin = await Penguin.create({
      name,
      category,
      likers,
      favs,
      likes: 1,
      description,
      image: img,
      imageBackup: imgBackup,
    });

    message = chalk.green(
      `${logPrefixgetCreate}${newPenguin.name} added successfully`
    );
    debug(message);

    res.status(201).json(newPenguin);
  } catch (err) {
    message = chalk.red(`${logPrefixgetCreate}ERROR saving: ${req.body.name}`);
    debug(message);

    message = chalk.red(`${logPrefixgetCreate}ERROR--> ${err}`);
    debug(message);

    err.message = `${logPrefixgetCreate}ERROR-> ${err}`;
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
      image: req.body.image || "",
      imageBackup: req.body.imageBackup || "",
      description: req.body.description,
    };
    message = chalk.green(`${logPrefixgetEdit}${penguinEdited.name}`);
    debug(message);

    await Penguin.findByIdAndUpdate(idPenguin, penguinEdited, {
      new: true,
    }).catch((error) => {
      message = `${logPrefixgetEdit}${type}ERROR: ${error.message}`;
      debug(chalk.red(message));
    });

    message = chalk.green(`${logPrefix} UPDATE: ${type}.`);
    debug(message);

    res.status(200).json(penguinEdited);

    message = chalk.green(`${logPrefix} UPDATE: Finished successfully.`);
    debug(message);
  } catch (error) {
    message = chalk.red(
      `${logPrefixgetEdit}ERROR-> ${error} (err.code: ${error.code})`
    );

    debug(message);

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
