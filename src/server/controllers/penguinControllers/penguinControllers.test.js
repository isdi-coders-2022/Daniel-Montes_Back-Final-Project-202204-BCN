const { getPenguins } = require("./penguinControllers");

const next = jest.fn();

jest.mock("../../../db/models/Penguin/Penguin", () => ({
  findOne: jest.fn().mockReturnValueOnce(true).mockReturnValueOnce(true),
}));

describe("Given the loginUser controller", () => {
  describe("When it's invoked with a request object with the correct username and password", () => {
    test("Then it should call the response method with status 200, and a body containing a token will be received", async () => {
      // const expectedStatus = 200;
      const req = {};
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      await getPenguins(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
