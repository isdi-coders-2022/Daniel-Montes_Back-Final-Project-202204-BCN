const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const connectDB = require("../../db");
const User = require("../../db/models/User");
const app = require("..");

let mongoServer;
let users;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();

  await connectDB(mongoServer.getUri());
});

beforeEach(async () => {
  await User.create(users[0]);
  await User.create(users[1]);
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoServer.stop();
  await mongoose.connection.close();
});

describe("Given a POST '/login' endpoint", () => {
  describe("When it receives a request", () => {
    users = [
      {
        name: "test",
        mail: "test@gmail.com",
        username: "test",
        password:
          "$2a$10$NwtqJAOXVZ2z2.jIVU6vE.p2d6Elc0U2aAkhL.z7khu5aDZGpS6pm",
      },
      {
        name: "test 1",
        mail: "test1@gmail.com",
        username: "test 1",
        password:
          "$2a$10$4iHWHlFBQ/1VbzyQ0B5tj.C78eC.msM1NL7wL3nrdkTT8IBfFRQ3a",
      },
    ];

    const userRequestReceived = {
      username: "test",
      password: "test",
    };

    test("Then it should specify json as the content type in the http header", async () => {
      const response = await request(app)
        .post("/user/login")
        .send(userRequestReceived);

      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });
  });
});

describe("Given a POST '/register' endpoint", () => {
  const newUserRequestReceived = {
    name: "hello",
    mail: "hello",
    username: "hello",
    password: "hello",
  };
  describe("When it receives a request", () => {
    test("Then it should receive the created user object", async () => {
      const { body } = await request(app)
        .post("/user/register")
        .send(newUserRequestReceived)
        .expect(201);

      expect(body.user).toBe(newUserRequestReceived.name);
    });
  });

  describe("When it receives a request with an existing user", () => {
    test("Then it should call the response method status code 409", async () => {
      await User.create(newUserRequestReceived);

      await request(app)
        .post("/user/register")
        .send(newUserRequestReceived)
        .expect(409);
    });
  });
});
