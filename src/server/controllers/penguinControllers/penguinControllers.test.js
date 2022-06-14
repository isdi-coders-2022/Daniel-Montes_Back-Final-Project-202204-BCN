const { getPenguins } = require("./penguinControllers");

const mockPenguins = require("../../../mocks/mocks");
const Place = require("../../../db/models/Penguin/Penguin");

describe("Given a createPlace middleware", () => {
  const req = {
    username: "Pinguinote",
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  describe("When it's invoked with a valide token", () => {
    test("Then it should call the response's status method with status code 200 and json method with a list of penguins", async () => {
      const expectedStatus = 200;
      Place.find = jest.fn().mockResolvedValue(mockPenguins);

      await getPenguins(null, res, null);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith({ penguins: mockPenguins });
    });
  });

  describe("When invoked with an invalid token", () => {
    test("Then it should call the next received function", async () => {
      const next = jest.fn();

      Place.find = jest.fn().mockRejectedValue({});
      await getPenguins(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
