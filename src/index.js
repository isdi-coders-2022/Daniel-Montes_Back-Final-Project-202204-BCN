require("dotenv").config();
const debug = require("debug")("Penguin:root");

const chalk = require("chalk");
const connectDB = require("./db");
const initializeServer = require("./server/initializeServer");

const port = process.env.PORT ?? 4000;
const connectionString = process.env.MONGODB_URI;

(async () => {
  try {
    await connectDB(connectionString);
    await initializeServer(port);
  } catch (error) {
    debug(chalk.red(`Exiting with error:  ${error}`));
    process.exit(1);
  }
})();
