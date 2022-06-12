const jwt = require("jsonwebtoken");
const auth = require("./auth");

describe("Given a auth function", () => {
  describe("When it receives a request with a valid authorization", () => {
    test("Then it should call the received next function and it should add the property userId to the request", () => {
      const req = {
        headers: {
          authorization: "Bearer hola",
        },
      };
      const next = jest.fn();

      jwt.verify = jest.fn().mockReturnValue({ id: 1 });

      auth(req, null, next);

      expect(next).toHaveBeenCalled();
      expect(req).toHaveProperty("userId", { id: 1 });
    });
  });

  describe("When it receives a request with a authorization withouth 'Bearer '", () => {
    test("Then it should call the received next ", () => {
      const req = {
        headers: {
          authorization: "Bea hola",
        },
      };
      const next = jest.fn();

      auth(req, null, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
