const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const chalk = require("chalk");
const debug = require("debug")(chalk.yellow("penguin:userController"));
const User = require("../../db/models/User/User");
const { customError } = require("../utils/customError");

const userLogin = async (req, res, next) => {
  const username = req.body.username.toString();
  const password = req.body.password.toString();

  if (!username || !password) {
    const error = customError(400, "Missing username or password...");

    next(error);
  } else {
    try {
      const user = await User.findOne({ username });

      if (!user) {
        const error = new Error("Incorrect password");
        debug("User not found");
        error.statusCode = 403;
        error.customMessage = "Username or password is wrong";

        next(error);
        return;
      }
      const userData = {
        username: user.username,
        id: user.id,
      };
      const rightPassword = await bcrypt.compare(password, user.password);

      if (!rightPassword) {
        debug("Password not found");
        const error = new Error("Incorrect password");
        error.statusCode = 403;
        error.customMessage = "Username or password is wrong";

        next(error);
        return;
      }
      const token = jsonwebtoken.sign(userData, process.env.JWT_SECRET);

      res.status(200).json({ token });
    } catch (err) {
      const error = customError(500, "Internal server error", err.message);
      next(error);
    }
  }
};

const userRegister = async (req, res, next) => {
  const { name, username, password } = req.body;
  const user = await User.findOne({ username });

  if (user) {
    const error = customError(409, "This user already exists...");

    next(error);
    return;
  }
  try {
    const encryptedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      name,
      username,
      password: encryptedPassword,
    };

    await User.create(newUser);

    const token = jsonwebtoken.sign(newUser, process.env.JWT_SECRET);

    res.status(201).json({ token });
  } catch (error) {
    const createdError = customError(400, "Wrong user data..", error.message);

    next(createdError);
  }
};

module.exports = { userLogin, userRegister };
