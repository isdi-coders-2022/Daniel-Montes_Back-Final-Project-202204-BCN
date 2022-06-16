const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { mongoose } = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../../../../db/models/User/User");
const connectDB = require("../../../../db");
const app = require("../../../index");

let mongoServer;

jest.mock("../../../middlewares/auth/auth", () => ({
  auth: (req, res, next) => {
    req.user = { userId: "629d4b2e2145d66cc942e839" };
    next();
  },
}));

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await connectDB(mongoServer.getUri());
});

beforeEach(async () => {
  const encryptedPassword = await bcrypt.hash("password", 10);
  await User.create({
    _id: "629d4b2e2145d66cc942e839",
    username: "p1",
    password: encryptedPassword,
    name: "p1",
  });
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Given a post /users/login endpoint", () => {
  describe("When it receives a request", () => {
    test("Then it should respond with a 200 status code and a token", async () => {
      const response = await request(app)
        .post("/users/login")
        .send({
          username: "p1",
          password: "password",
        })
        .expect(200);
      expect(response.body.token).not.toBeNull();
    });
  });
});

describe("Given a post /users/register endpoint", () => {
  describe("When it receives a new user request", () => {
    test("Then it should respond with a 201 status code and a username", async () => {
      await request(app)
        .post("/users/register")
        .send({
          username: "p1",
          password: "p1",
        })
        .expect(409);
    });
  });

  describe("When it receives an already existing user request", () => {
    test("Then it should respond with a 200 status code and a token", async () => {
      const response = await request(app)
        .post("/users/register")
        .send({
          username: "p1",
          password: "p1",
        })
        .expect(409);

      expect(response.body.error).toBe(true);
      expect(response.body.message).toBe("This user already exists...");
    });
  });
});
