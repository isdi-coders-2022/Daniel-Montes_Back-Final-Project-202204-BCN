const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const chalk = require("chalk");
const debug = require("debug")(chalk.blue("AAP:UControllers"));
const User = require("../../../db/models/User/User");
const { customError } = require("../../utils/customError");

const logPrefix = chalk.white("User Request--> ");
const logPrefixLogin = chalk.blue(`${logPrefix}LOGIN: `);
const logPrefixRegister = chalk.blue(`${logPrefix}REGISTER: `);
const logPrefixGet = chalk.blue(`${logPrefix}GET User: `);
const logPrefixEdit = chalk.blue(`${logPrefix}EDIT User: `);

let message = "";

const userLogin = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    message = `${logPrefixLogin}Missing username or password...`;
    const error = customError(400, message);
    debug(chalk.red(message));

    next(error);
  } else {
    try {
      debug(chalk.green(`${logPrefixLogin}${username}`));
      const user = await User.findOne({ username });

      if (!user) {
        message = `${logPrefixLogin}Username or password is wrong`;
        const error = new Error(message);

        error.statusCode = 403;
        error.customMessage = chalk.red(message);
        debug(chalk.red(message));

        next(error);
        return;
      }

      const userData = {
        id: user.id,
        name: user.name,
        username: user.username,
        isAdmin: user.isAdmin,
        image: user.image,
      };

      const rightPassword = await bcrypt.compare(password, user.password);

      if (!rightPassword) {
        message = `${logPrefixLogin}Password not found`;
        debug(message);

        const error = new Error(message);
        error.statusCode = 403;
        error.customMessage = message;

        next(error);
        return;
      }

      const token = jsonwebtoken.sign(userData, process.env.JWT_SECRET);

      debug(
        chalk.green(`${logPrefixLogin}${String(username)} logged successfully.`)
      );

      res.status(200).json({ token });
    } catch (err) {
      message = `${logPrefixLogin}ERROR ${err.message}`;
      const error = customError(500, message, err.message);

      debug(chalk.red(message));

      next(error);
    }
  }
};

const userRegister = async (req, res, next) => {
  const { name, username, password, img } = req.body;

  message = `${logPrefixRegister}${username}`;

  debug(chalk.green(message));

  const user = await User.findOne({ username });

  if (user) {
    message += `. This user already exists...`;

    const error = customError(409, message);
    debug(chalk.red(message));

    next(error);
    return;
  }
  try {
    const encryptedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      name,
      username,
      password: encryptedPassword,
      isAdmin: false,
      image: img,
    };

    await User.create(newUser);

    debug(
      chalk.green(`${logPrefixRegister}${username} successfully registered.`)
    );
    const token = jsonwebtoken.sign(newUser, process.env.JWT_SECRET);

    res.status(201).json({ token });
  } catch (error) {
    message = `${logPrefixRegister}ERROR ${error.message}`;

    debug(chalk.red(message));
    const createdError = customError(400, message, error.message);

    next(createdError);
  }
};

const userGet = async (req, res, next) => {
  try {
    const { UserId } = req.params;
    debug(`${logPrefixGet}${chalk.green(`${String(UserId)}`)}`);

    const user = await User.findById(UserId);
    const { username } = user;
    message = `${logPrefixGet} ${username} found!`;
    debug(chalk.green(message));

    res.status(200).json(user);
  } catch (err) {
    message = `${logPrefixGet} ERROR: ${err}`;
    debug(chalk.red(message));

    err.message = `${logPrefixGet} ${err}`;
    err.code = 404;

    next(err);
  }
};

const userEdit = async (req, res) => {
  const type = req.query.task;

  try {
    const { idUser } = req.params;
    const userEdited = {
      name: req.body.name,
      category: req.body.category,
      likes: req.body.likes,
      likers: req.body.likers,
      favs: req.body.favs,
      image: req.img || "",
      imageBackup: req.body.imageBackup || "",
      description: req.body.description,
    };
    message = chalk.green(`${logPrefixEdit}${userEdited.name}->${type}`);
    debug(message);

    await User.findByIdAndUpdate(idUser, userEdited, {
      new: true,
    });

    message = chalk.green(`${logPrefixEdit}Finished successfully.`);
    debug(message);

    res.status(200).json(userEdited);
  } catch (error) {
    message = chalk.red(
      `${logPrefixEdit}ERROR-> ${error} (err.code: ${error.code})`
    );

    debug(message);

    error.customMessage = `${logPrefixEdit}${type}. ERROR User not found.`;
    error.code = 400;
  }
};

module.exports = { userLogin, userRegister, userGet, userEdit };
