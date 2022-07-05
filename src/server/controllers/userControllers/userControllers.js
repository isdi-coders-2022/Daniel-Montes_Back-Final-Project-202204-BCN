const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const chalk = require("chalk");
const debug = require("debug")("AAP:UControllers");
const User = require("../../../db/models/User/User");
const { customError } = require("../../utils/customError");

const logPrefix = "User Request-->";

const userLogin = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    const error = customError(
      400,
      `${logPrefix} Missing username or password...`
    );
    debug(chalk.red(`${logPrefix} ERROR: ${error.message}`));

    next(error);
  } else {
    try {
      debug(chalk.green(`${logPrefix} LOGIN: ${username}`));
      const user = await User.findOne({ username });

      if (!user) {
        const message = `${logPrefix} LOGIN: Username or password is wrong`;
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
        image: user.image,
      };

      const rightPassword = await bcrypt.compare(password, user.password);

      if (!rightPassword) {
        const message = `${logPrefix}LOGIN: Password not found`;
        debug(message);

        const error = new Error(message);
        error.statusCode = 403;
        error.customMessage = message;

        debug(chalk.red(message));

        next(error);
        return;
      }

      const token = jsonwebtoken.sign(userData, process.env.JWT_SECRET);

      debug(
        chalk.green(
          `${logPrefix} LOGIN: ${String(username)} logged successfully.`
        )
      );

      res.status(200).json({ token });
    } catch (err) {
      const message = `${logPrefix} LOGIN: ERROR ${err.message}`;
      const error = customError(500, message, err.message);

      debug(chalk.red(message));

      next(error);
    }
  }
};

const userRegister = async (req, res, next) => {
  const { name, username, password } = req.body;
  const { img, imgBackup } = req;
  let message = `${logPrefix} REGISTER: ${username}`;

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
      image: img,
      imageBackup: imgBackup,
    };

    await User.create(newUser);

    debug(
      chalk.green(`${logPrefix} REGISTER: ${username} successfully registered.`)
    );
    const token = jsonwebtoken.sign(newUser, process.env.JWT_SECRET);

    res.status(201).json({ token });
  } catch (error) {
    message = `${logPrefix} REGISTER: ERROR ${error.message}`;

    debug(chalk.red(message));
    const createdError = customError(400, message, error.message);

    next(createdError);
  }
};

const getUser = async (req, res, next) => {
  try {
    const { UserId } = req.params;
    debug(chalk.green(`${logPrefix} GET User: ${String(UserId)}`));
    const user = await User.findById(UserId);
    const { username } = user;
    debug(chalk.green(`${logPrefix} GET User: ${username} found!`));

    res.status(200).json(user);
  } catch (err) {
    err.message = `GET User: User id: ${req.params.UserId}`;
    err.code = 404;

    next(err);
  }
};
module.exports = { userLogin, userRegister, getUser };
