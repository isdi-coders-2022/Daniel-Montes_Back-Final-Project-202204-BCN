const { Schema, model } = require("mongoose");

const PenguinSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  category: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
  imageBackup: {
    type: String,
    required: false,
  },
  likes: {
    type: Number,
    required: false,
  },
  likers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  favs: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  description: {
    type: String,
    required: false,
  },
});

const Penguin = model("Penguin", PenguinSchema, "penguins");

module.exports = Penguin;
