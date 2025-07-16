const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  hotelCode: String,
  name: String,
  fb_page_id: String,
  zalo_oa_id: String,
  address: String
});

module.exports = mongoose.model('Hotel', hotelSchema);
