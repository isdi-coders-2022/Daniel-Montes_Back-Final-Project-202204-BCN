const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const connectDB = require("../../../../db/index");
const Penguin = require("../../../../db/models/Penguin/Penguin");
const app = require("../../../index");

let mongoServer;
let penguins = [];

penguins = [
  {
    name: "penguin1",
    category: "cat1",
  },
  {
    name: "penguin2",
    category: "cat2",
  },
];
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();

  await connectDB(mongoServer.getUri());
});

beforeEach(async () => {
  await Penguin.create(penguins[0]);
  await Penguin.create(penguins[1]);
});

afterEach(async () => {
  await Penguin.deleteMany({});
});

afterAll(async () => {
  await mongoServer.stop();
  await mongoose.connection.close();
});

describe("Given a POST '/login' endpoint", () => {
  describe("When it receives a request", () => {
    test("Then it should specify json as the content type in the http header", async () => {
      const response = await request(app).get("/penguins").send();

      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });
  });
});
