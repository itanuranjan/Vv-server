const mongoose = require("mongoose");

const heroSchema = new mongoose.Schema({
  src: String,
  alt: String,
});

const HeroModel = mongoose.model("HeroModel", heroSchema);

module.exports = HeroModel;
