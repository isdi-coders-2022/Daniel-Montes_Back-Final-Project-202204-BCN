const { auth } = require("./auth");

const mockId = { name: "papito", username: "chocolatero", id: 3 };

jest.mock("jsonwebtoken", () => ({
  ...jest.requireActual("jsonwebtoken"),
  verify: () => mockId,
}));

describe("Given the auth function", () => {
  describe("When it receives a request with a valid token", () => {
    const req = {
      headers: {
        authorization: "Bearer ",
      },
    };

    test("Then the 'next' function should be invoked", () => {
      const next = jest.fn();

      auth(req, null, next);

      expect(next).toHaveBeenCalled();
    });

    test("Then it should add to the received request the user id by the token", () => {
      const next = () => {};

      auth(req, null, next);

      expect(req).toHaveProperty("userId", mockId);
    });
  });
  describe("When it receives a request with an invalid token", () => {
    const req = {
      headers: {
        authorization: "NotBear",
      },
    };

    test("Then an error with 'Invalid authentication' message will be thrown", () => {
      const expectedMessage = "Invalid authentication";
      const expectedError = new Error(expectedMessage);
      const next = jest.fn();

      auth(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
