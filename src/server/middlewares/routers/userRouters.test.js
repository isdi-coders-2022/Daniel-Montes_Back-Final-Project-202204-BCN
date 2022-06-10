const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const connectDB = require("../../../db/index");
const User = require("../../../db/models/User/User");
const app = require("../../index");
const firebase = require("../firebase/firebase");

let mongoServer;
let users;

jest.mock = firebase;
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
        username: "test",
        password:
          "$2a$10$NwtqJAOXVZ2z2.jIVU6vE.p2d6Elc0U2aAkhL.z7khu5aDZGpS6pm",
      },
      {
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
        .post("/login")
        .send(userRequestReceived);

      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });
  });
});
