const bcrypt = require("bcrypt");
const User = require("../../db/models/User/User");

const { userLogin, userRegister } = require("./userControllers");

const token = "030d715845518298a37ac8fa80f966eb7349d5e2";
jest.mock("../../db/models/User/User", () => ({
  findOne: jest.fn().mockReturnValueOnce(true).mockReturnValueOnce(true),
}));

jest.mock("bcrypt", () => ({
  ...jest.requireActual("bcrypt"),
  compare: () =>
    jest.fn().mockResolvedValueOnce(true).mockRejectedValueOnce(false),
}));

jest.mock("jsonwebtoken", () => ({
  ...jest.requireActual("jsonwebtoken"),
  sign: () => token,
}));

const next = jest.fn();

describe("Given the loginUser controller", () => {
  const req = { body: { username: "hello", password: "hello" } };
  describe("When it's invoked with a request object with the correct username and password", () => {
    test("Then it should call the response method with status 200, and a body containing a token will be received", async () => {
      const expectedStatus = 200;

      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      await userLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith({ token });
    });
  });

  describe("When it's invoked with a request object and the username or password are wrong", () => {
    test("Then it should call the next method function", async () => {
      User.findOne = jest.fn().mockResolvedValue(false);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await userLogin(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("When it's invoked with a request object containing an incorrect password", () => {
    test("Then it should receive the next expected function", async () => {
      User.findOne = jest.fn().mockResolvedValue(true);
      bcrypt.compare = jest.fn().mockResolvedValue(false);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await userLogin(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("When userRegister it's invoked", () => {
    test("Then it should receive the next expected function", async () => {
      User.findOne = jest.fn().mockResolvedValue(true);
      bcrypt.compare = jest.fn().mockResolvedValue(false);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await userRegister(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
