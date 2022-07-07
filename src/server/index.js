const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const usersRouters = require("./middlewares/routers/userRouters/userRouters");
const penguinRouters = require("./middlewares/routers/penguinRouters/penguinRouters");
const { notFoundError, generalError } = require("./middlewares/errors/errors");

const app = express();

app.disable("x-powered-by");
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(helmet());

app.use(express.static("uploads"));

app.use("/users", usersRouters);
app.use("/penguins", penguinRouters);

app.use(notFoundError);
app.use(generalError);

module.exports = app;
