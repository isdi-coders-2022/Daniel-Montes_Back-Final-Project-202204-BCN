const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const debug = require("debug")("Penguin:srv:middlewares:errors");
const User = require("../../db/models/User");

const loginUser = async (req, res, next) => {
  const username = req.body.username.toString();
  const password = req.body.password.toString();

  const user = await User.findOne({ username });

  if (!user) {
    const error = new Error("Incorrect password");
    error.statusCode = 403;
    error.customMessage = "Username or password is wrong";

    next(error);
  } else {
    const userData = {
      name: user.name,
      username: user.username,
      id: user.id,
    };
    const rightPassword = await bcrypt.compare(password, user.password);

    if (!rightPassword) {
      const error = new Error("Incorrect password");
      error.statusCode = 403;
      error.customMessage = "Username or password is wrong";

      next(error);
    } else {
      const token = jsonwebtoken.sign(userData, process.env.JWT_SECRET_USER);

      res.status(200).json({ token });
    }
  }
};

const registerUser = async (req, res, next) => {
  const { name, username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      const encryptedPassword = await bcrypt.hash(password, 10);

      const newUser = {
        name,
        username,
        password: encryptedPassword,
      };

      await User.create(newUser);

      res.status(201).json({ user: name });
    } else {
      const userError = new Error();
      userError.customMessage = "User name already exist";
      userError.statusCode = 409;
      next(userError);
      debug("jamón");
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { loginUser, registerUser };
