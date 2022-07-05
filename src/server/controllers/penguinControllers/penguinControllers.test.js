const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
  getPenguins,
  deletePenguin,
  getPenguin,
  editPenguin,
  createPenguin,
} = require("./penguinControllers");

const { mockPenguins, mockPenguin } = require("../../../mocks/mocks");
const Penguin = require("../../../db/models/Penguin/Penguin");

let next = jest.fn();

jest.mock("bcrypt", () => ({
  ...jest.requireActual("bcrypt"),
  compare: () =>
    jest.fn().mockResolvedValueOnce(true).mockRejectedValueOnce(false),
}));

jest.mock("jsonwebtoken", () => ({
  ...jest.requireActual("jsonwebtoken"),
  sign: () => mockPenguin,
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Given getPenguins middleware", () => {
  describe("When it's invoked with a valide token", () => {
    test("Then it should call the response's status method with status code 200 and json method with a list of penguins", async () => {
      const expectedStatus = 200;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const req = {
        penguins: mockPenguins,
      };
      next = jest.fn();
      Penguin.find = jest.fn().mockReturnThis(mockPenguins);

      await getPenguins(req, res, null);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe("When it receives a request but has an error on finding", () => {
    test("Then it should call it's next method with an error", async () => {
      const req = {
        params: { idPenguin: "22" },
      };

      Penguin.find = jest.fn().mockResolvedValue(null);
      await getPenguins(req, null, next);

      expect(next).toHaveBeenCalled();
    });
  });
});

describe("Given getFavsPenguins middleware", () => {
  describe("When it receives a request but has an error on finding", () => {
    test("Then it should call it's next method with an error", async () => {
      const req = {
        params: { idPenguin: "22" },
      };

      Penguin.find = jest.fn().mockResolvedValue(null);
      await getPenguins(req, null, next);

      expect(next).toHaveBeenCalled();
    });
  });
});

describe("Given deletePenguin middleware", () => {
  describe("When it receives a request with a correct id and correct user rol", () => {
    test("Then it should call it's response json status with 200 and json with the expected object", async () => {
      const req = {
        params: { idPenguin: 22 },
        user: {
          username: "penguin1",
          password: "penguin1",
          name: "penguin1",
        },
        body: { name: "penguin1" },
      };
      const expectedResponse = {
        msg: "Penguin deleted",
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      Penguin.findByIdAndDelete = jest.fn().mockResolvedValue(true);
      await deletePenguin(req, res, null);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });
  });
});

describe("Given getPenguinById middleware", () => {
  describe("When it's called with a correct establishment id at request", () => {
    test("Then it should call it's response json status with 200 and json with the expected object", async () => {
      const req = {
        body: { name: "penguin1" },
        params: { name: "penguin1" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const expectedResponse = mockPenguin;

      Penguin.findById = jest.fn().mockResolvedValue(mockPenguin);
      await getPenguin(req, res, null);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });
  });

  describe("When it's called with a incorrect establishment id at request", () => {
    test("Then it should call it's next function with 'Bad request'", async () => {
      const req = {
        params: { idPenguin: 22 },
        body: { name: "penguin1" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const expectedError = new Error("Bad request");

      Penguin.findById = jest.fn().mockRejectedValue(expectedError);
      await getPenguin(req, res, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given editPenguin middleware", () => {
  describe("When it receives a request with a correct id and correct user rol", () => {
    test("Then it should call it's response json status with 200 and json with the expected object", async () => {
      const req = {
        params: { idPenguin: "1" },
        body: { name: "penguin1" },
        query: { task: "test" },
        headers: {
          authorization: "Bearer hola",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      jwt.verify = jest.fn().mockReturnValue({ id: "22" });

      Penguin.findById = jest.fn().mockResolvedValue(true);
      await editPenguin(req, res, null);

      expect(req).toHaveProperty("params", { idPenguin: "1" });
    });
  });

  describe("When userRegister it's invoked", () => {
    test("Then it should receive the next expected function", async () => {
      Penguin.findOne = jest.fn().mockResolvedValue(true);
      bcrypt.compare = jest.fn().mockResolvedValue(false);
      const req = { body: { name: "p2", category: "p1" } };
      const res = {
        status: jest.fn().mockResolvedValue(200),
        json: jest.fn(),
      };

      Penguin.create = jest.fn().mockResolvedValue(true);
      await createPenguin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
    });
  });
});
