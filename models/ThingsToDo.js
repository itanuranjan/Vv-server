const mongoose = require("mongoose");

const thingstodoSchema = new mongoose.Schema({
  title: String,
  city: String,
  imageUrl: String,
  route: String,
});

const ThingsToDo = mongoose.model("ThingsToDo", thingstodoSchema);

module.exports = ThingsToDo;
