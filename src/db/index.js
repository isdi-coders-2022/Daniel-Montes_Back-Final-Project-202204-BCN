require("dotenv").config();
const chalk = require("chalk");
const debug = require("debug")(chalk.blue("AAP:db:connection:"));
const mongoose = require("mongoose");

const connectDB = (connectionString) =>
  new Promise((resolve, reject) => {
    mongoose.set("debug", true);
    mongoose.set("toJSON", {
      virtuals: true,
      transform: (doc, ret) => {
        const newReturnedJSON = { ...ret };

        // eslint-disable-next-line no-underscore-dangle
        delete newReturnedJSON._id;
        // eslint-disable-next-line no-underscore-dangle
        delete newReturnedJSON.__v;

        return newReturnedJSON;
      },
    });
    mongoose.connect(connectionString, (error) => {
      if (error) {
        debug(chalk.red("Error on connecting to database:", error.message));
        reject();
        return;
      }
      debug(chalk.green("Connected to database"));
      resolve();
    });
  });

module.exports = connectDB;
