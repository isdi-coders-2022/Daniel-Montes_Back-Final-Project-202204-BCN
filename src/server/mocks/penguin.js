const mockUser = {
  userId: {
    username: "pinguinako",
  },
};

const alternativeToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibmV3dXNlciIsInN1cm5hbWUiOiJ0ZXN0IiwidXNlcm5hbWUiOiJ0ZXN0IiwiaWF0IjoxNjU0MzMxODI2fQ.E7Ny36rJbHF6olYZ749fSykCoYIbJHTYWeNUwFYqO6c";

const mockToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTWFydGEiLCJzdXJuYW1lIjoiQW1pZ2EiLCJ1c2VybmFtZSI6Im1hcnRhIiwiaWF0IjoxNjU0Mjg0NjUyfQ.mJSMLapcKXOUZVe6VlTwZFyMfv5e9UcVfoWrLLBZ980";

const mockPenguin = {
  entries: [
    {
      username: "lolo",
    },
    {
      username: "lolo lorololo",
    },
  ],
};

module.exports = { mockUser, mockPenguin, mockToken, alternativeToken };
