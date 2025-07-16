const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  hotelCode: String,
  name: String,
  capacity: Number,
  view: String,
  price: Number,
  amenities: [String],
  description: String
});

module.exports = mongoose.model('Room', roomSchema);
