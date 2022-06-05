const request = require("supertest");
const { mongoose } = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../..");
const { mockToken, alternativeToken } = require("../../mocks/penguin");
const User = require("../../../db/models/User/User");
const { Entry } = require("../../../db/models/Penguin/Penguin");
const connectDB = require("../../../db/index");

let mongoServer;
let users;
let inputtedEntries;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await connectDB(mongoServer.getUri());
});

beforeEach(async () => {
  await User.create(users[0]);
  await User.create(users[1]);
  await Entry.create(inputtedEntries[0]);
  await Entry.create(inputtedEntries[1]);
  await Entry.create(inputtedEntries[2]);
});

afterEach(async () => {
  await User.deleteMany({});
  await Entry.deleteMany({});
});

afterAll(async () => {
  mongoServer.stop();
  await mongoose.connection.close();
});

describe("Given the GET /all penguins router", () => {
  users = [
    {
      username: "penguin1",
      password: "$2a$10$NwtqJAOXVZ2z2.jIVU6vE.p2d6Elc0U2aAkhL.z7khu5aDZGpS6pm",
    },
    {
      username: "penguin2",
      password: "$2a$10$4iHWHlFBQ/1VbzyQ0B5tj.C78eC.msM1NL7wL3nrdkTT8IBfFRQ3a",
    },
  ];

  inputtedEntries = [
    {
      _id: mongoose.Types.ObjectId("507f1f77bcf86cd799439011"),
      vitality: 1,
      positiveEmotion: 1,
      engagement: 2,
      relationships: 3,
      meaning: 4,
      accomplishment: 5,
      wellBeing: 4,
      image: "img",
      commentary: "Hola",
    },
    {
      _id: mongoose.Types.ObjectId("507f1f77bcf86cd799439012"),
      vitality: 1,
      positiveEmotion: 1,
      engagement: 2,
      relationships: 3,
      meaning: 4,
      accomplishment: 5,
      wellBeing: 4,
      image: "img",
      commentary: "Hola",
    },
    {
      _id: mongoose.Types.ObjectId("507f1f77bcf86cd799439013"),
      vitality: 1,
      positiveEmotion: 1,
      engagement: 2,
      relationships: 3,
      meaning: 4,
      accomplishment: 5,
      wellBeing: 4,
      image: "img",
      commentary: "Hola",
    },
  ];
  describe("When it receives a valid request", () => {
    test("Then a response containing 3 diary entries will be received, each having the properties of vitality, date and image", async () => {
      const {
        body: { entries },
      } = await request(app)
        .get("/penguins")
        .set("Authorization", `Bearer ${mockToken}`);

      const expectedLength = 3;
      const expectedProperties = ["vitality", "date", "image"];

      expect(entries).toHaveLength(expectedLength);
      expect(entries[2]).toHaveProperty(expectedProperties[0]);
      expect(entries[2]).toHaveProperty(expectedProperties[1]);
      expect(entries[2]).toHaveProperty(expectedProperties[2]);
    });
  });
  describe("When the user doesn't exist", () => {
    test("Then a response with a status 403 will be received", async () => {
      const response = await request(app)
        .get("/diary/all")
        .set("Authorization", `Bearer ${alternativeToken}`);

      const expectedProperty = "msg";
      const expectedMessage = "User not found";
      expect(response.body).toHaveProperty(expectedProperty, expectedMessage);
    });
  });
});
