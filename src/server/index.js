const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const usersRouter = require("./middlewares/routers/userRouters");
const { notFoundError, generalError } = require("./middlewares/errors/errors");

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:4000",
    "http://localhost:4001",
    "http://localhost:4002",
    "http://localhost:5000",
    "http://localhost:5001",
    "http://localhost:5002",
    "https://daniel-montes-final-project-202204-bcn.netlify.app/",
    "https://daniel-montes-final-project-202204-bcn.netlify.app",
  ],
};

const app = express();

app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json());
app.use(helmet());

app.post("/users/login", usersRouter);

app.use(notFoundError);
app.use(generalError);

module.exports = app;
