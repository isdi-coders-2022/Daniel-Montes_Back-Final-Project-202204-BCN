const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const chalk = require("chalk");
const debug = require("debug")(chalk.blue("AAP:UControllers"));
const User = require("../../../db/models/User/User");
const { customError } = require("../../utils/customError");

const logPrefix = chalk.white("User Request--> ");
const logPrefixLogin = `${logPrefix}${chalk.blue(`LOGIN: `)}`;
const logPrefixRegister = `${logPrefix}${chalk.blue(`REGISTER: `)}`;
const logPrefixGetUser = `${logPrefix}${chalk.blue(`GET User:  `)}`;

const userLogin = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    const message = `${logPrefixLogin}Missing username or password...`;
    const error = customError(400, message);
    debug(chalk.red(message));

    next(error);
  } else {
    try {
      debug(chalk.green(`${logPrefixLogin}${username}`));
      const user = await User.findOne({ username });

      if (!user) {
        const message = `${logPrefixLogin}Username or password is wrong`;
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
        const message = `${logPrefixLogin}Password not found`;
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
      const message = `${logPrefixLogin}ERROR ${err.message}`;
      const error = customError(500, message, err.message);

      debug(chalk.red(message));

      next(error);
    }
  }
};

const userRegister = async (req, res, next) => {
  const { name, username, password } = req.body;
  const { img, imgBackup } = req;
  let message = `${logPrefixRegister}${username}`;

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
      imageBackup: imgBackup,
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

const getUser = async (req, res, next) => {
  try {
    const { UserId } = req.params;
    debug(`${logPrefixGetUser}${chalk.green(`${String(UserId)}`)}`);
    const user = await User.findById(UserId);
    const { username } = user;
    debug(`${logPrefixGetUser}${chalk.green(`${username} found!`)}`);

    res.status(200).json(user);
  } catch (err) {
    debug(`${logPrefixGetUser}${chalk.red(`ERROR: ${err}`)}`);
    err.message = `${logPrefixGetUser} ${err}`;
    err.code = 404;

    next(err);
  }
};
module.exports = { userLogin, userRegister, getUser };
