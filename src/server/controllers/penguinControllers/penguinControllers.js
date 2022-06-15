const debug = require("debug")("penguin:penguinControllers");
const chalk = require("chalk");
const jwt = require("jsonwebtoken");
const Penguin = require("../../../db/models/Penguin/Penguin");

const getPenguin = async (req, res, next) => {
  try {
    const { idPenguin } = req.params;
    debug(chalk.green(`User Request--> GET penguin id: ${idPenguin}`));
    const penguin = await Penguin.findById(idPenguin);

    debug(chalk.green(`Found: ${penguin}`));

    res.status(200).json(penguin);
  } catch (err) {
    err.message = `ERROR: getting a penguin with id: ${req.params.idPenguin}`;
    err.code = 404;

    next(err);
  }
};

const getPenguins = async (req, res, next) => {
  try {
    const penguins = await Penguin.find();

    debug(chalk.green(`User Request--> GET full list of Penguins...`));
    debug(chalk.green(`Total found: ${penguins.length} cute penguins.`));

    res.status(200).json({ penguins });
  } catch (err) {
    err.message = "ERROR: getting all penguins";
    err.code = 404;

    next(err);
  }
};

const getFavsPenguins = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const token = authorization.replace("Bearer ", "");
    const { username, id } = jwt.verify(token, process.env.JWT_SECRET);

    if (username) {
      debug(
        chalk.green(
          `User Request--> GET favs for username: ${username} (id: ${id})`
        )
      );
    } else {
      debug(chalk.rede(`ERROR: User Request--> GET favs `));
    }

    const penguins = await Penguin.find({ owner: id });

    debug(chalk.green(`Total found: ${penguins.length}.`));

    if (penguins.length !== 0) {
      res.status(200).json({ penguins });
    } else {
      const userError = new Error();
      userError.customMessage = "No penguins found!";
      userError.statusCode = 400;
      next(userError);
    }
  } catch (err) {
    err.message = "ERROR: getting all penguins";
    err.code = 404;
  }
};

const deletePenguin = async (req, res, next) => {
  const { idPenguin } = req.params;

  try {
    await Penguin.findByIdAndDelete(idPenguin);
    debug(chalk.green(`User Request--> DELETE penguin id: ${idPenguin}`));

    res.status(200).json({ msg: "Penguin deleted" });
    debug(chalk.green(` Penguin id: ${idPenguin}  deleted`));
  } catch (err) {
    debug(chalk.red("Penguin id not found"));
    err.message = "Penguin id not found";
    err.code = 404;

    next(err);
  }
};

const createPenguin = async (req, res) => {
  try {
    debug(chalk.green(`User Request--> CREATE penguin name: ${req.body.name}`));
    const penguin = req.body;
    const newPenguin = await Penguin.create(penguin);

    res.status(201).json(newPenguin);
    debug(chalk.green(`Created fav! ${newPenguin.name}`));
  } catch (err) {
    debug(
      chalk.red(`ERROR CREATE New Fav: ${req.body.name}: id( ${req.body.id} )`)
    );

    debug(chalk.red(`ERROR-> ${err} (err.code: ${err.code})`));
    err.message = "Error creating the penguin";
    err.code = 404;
  }
};

const editPenguin = async (req, res) => {
  debug(chalk.green(`User Request--> EDIT penguin: ${req.body.name}`));
  const { authorization } = req.headers;
  const token = authorization.replace("Bearer ", "");
  const { id } = jwt.verify(token, process.env.JWT_SECRET);

  const { idPenguin } = req.params;

  try {
    const penguinToEdit = await Penguin.findById(idPenguin);

    const penguinEdited = {
      name: penguinToEdit.name,
      likes: penguinToEdit.likes,
      description: penguinToEdit.description,
      category: penguinToEdit.category,
      image: penguinToEdit.image,
      imageBackup: penguinToEdit.imageBackup,
      owner: id,
    };
    const newPenguin = await Penguin.findByIdAndUpdate(
      idPenguin,
      penguinEdited,
      {
        new: true,
      }
    );

    res.status(200).json(newPenguin);
    debug(chalk.green(`Saved fav! ${newPenguin.name}`));
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
