const bcrypt = require("bcrypt");
const { loginUser } = require("./userControllers");
const User = require("../../db/models/User");

const mockExpectedToken = "xxxx";
jest.mock("../../db/models/User", () => ({
  findOne: jest.fn().mockReturnValueOnce(true).mockReturnValueOnce(true),
}));

jest.mock("bcrypt", () => ({
  ...jest.requireActual("bcrypt"),
  compare: () =>
    jest.fn().mockResolvedValueOnce(true).mockRejectedValueOnce(false),
}));

jest.mock("jsonwebtoken", () => ({
  ...jest.requireActual("jsonwebtoken"),
  sign: () => mockExpectedToken,
}));

const next = jest.fn();

describe("Given the loginUser controller", () => {
  const req = { body: { username: "Daddy", password: "Yankee" } };
  describe("When invoked with a request object with a correct username and password", () => {
    test("Then a response with status 200, and a body containing a token will be received", async () => {
      const expectedStatus = 200;

      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith({ token: mockExpectedToken });
    });
  });

  describe("When invoked with a request object with an username that is not present in the database", () => {
    test("Then it should call the next expected function", async () => {
      User.findOne = jest.fn().mockResolvedValue(false);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await loginUser(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("When invoked with a request object containing an incorrect password", () => {
    test("Then it should receive the next expected function", async () => {
      User.findOne = jest.fn().mockResolvedValue(true);
      bcrypt.compare = jest.fn().mockResolvedValue(false);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await loginUser(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
