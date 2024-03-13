const mongoose = require('mongoose');

const topRecommentedSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  route: { type: String, required: true },
  rating: { type: Number, required: true },
  price: { type: Number, required: true },
});

const TopRecommented = mongoose.model('TopRecommented', topRecommentedSchema);

module.exports = TopRecommented;
