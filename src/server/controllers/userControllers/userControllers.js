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
        const error = new Error("Incorrect password");
        debug("User not found");
        error.statusCode = 403;
        error.customMessage = `${logPrefix} LOGIN: Username or password is wrong`;
        debug(`${logPrefix} ${error.customMessage}`);

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
        debug(`${logPrefix} Password not found`);
        const error = new Error("Incorrect password");
        error.statusCode = 403;
        error.customMessage = `${logPrefix} LOGIN: Username or password is wrong`;

        debug(chalk.red(`${logPrefix} ERROR: ${error.message}`));

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
      const error = customError(500, "Internal server error", err.message);
      debug(chalk.red(`${logPrefix} LOGIN: ERROR ${err.message}`));

      next(error);
    }
  }
};

const userRegister = async (req, res, next) => {
  const { name, username, password } = req.body;
  const { img, imgBackup } = req;

  debug(chalk.green(`${logPrefix} REGISTER: ${username}`));
  const user = await User.findOne({ username });

  if (user) {
    const error = customError(
      409,
      `${logPrefix} REGISTER: This user already exists...`
    );
    debug(chalk.red(`${logPrefix} REGISTER: ERROR user already exists.`));
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
    debug(chalk.red(`${logPrefix} REGISTER: ERROR ${error.message}`));
    const createdError = customError(
      400,
      `${logPrefix} REGISTER: Wrong user data..`,
      error.message
    );

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
