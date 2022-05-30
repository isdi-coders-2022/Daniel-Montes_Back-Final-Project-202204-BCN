const { notFoundError, generalError } = require("./errors");

describe("Given a notFoundError function", () => {
  describe("When its invoked with a response", () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    test("Then it should call the reponse's method status with a 404", () => {
      const expectedStatusCode = 404;

      notFoundError(null, res);

      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
    });
  });
  describe("When its invoked with a response with a message 'WGeneral error'", () => {
    test("Then it should call the responses method status with a 401 and a 'General error' message", () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const error = {
        statusCode: 500,
        message: "Wrong username",
      };
      const expectedStatus = 500;
      const expectedMessage = "General error";

      generalError(error, null, res);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(expectedMessage);
    });
  });
});
