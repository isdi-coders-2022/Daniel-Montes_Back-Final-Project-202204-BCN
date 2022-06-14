const { Joi } = require("express-validation");

const penguinSchema = {
  body: Joi.object({
    name: Joi.string().max(20),
    category: Joi.string().max(20),
    image: Joi.string().max(20),
    likes: Joi.number().integer(),
    description: Joi.string().max(200),
    owner: Joi.array().items(Joi.string().max(20)),
  }),
};

module.exports = { penguinSchema };
