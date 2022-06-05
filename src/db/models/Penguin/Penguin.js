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
});

const Penguin = model("Penguin", PenguinSchema, "penguins");

module.exports = Penguin;
