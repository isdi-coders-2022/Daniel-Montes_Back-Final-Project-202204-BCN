const { Schema, model } = require("mongoose");

const PenguinSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
  category: {
    type: String,
    required: false,
  },
  likes: {
    type: Number,
    required: false,
  },
});

const Penguin = model("Penguin", PenguinSchema, "penguins");

module.exports = Penguin;
