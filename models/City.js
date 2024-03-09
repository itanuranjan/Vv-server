// models/City.js
const mongoose = require("mongoose");

const citySchema = new mongoose.Schema({
  title: String,
  description: String,
  imageUrl: String,
  route: String,
});

const CityModel = mongoose.model("City", citySchema);

module.exports = CityModel;
