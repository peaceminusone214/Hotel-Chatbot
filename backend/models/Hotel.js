const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  hotelCode: String,
  name: String,
  fb_page_id: String,
  fb_page_token: String,
  zalo_oa_id: String,
  zalo_access_token: String,
  address: String,
  prompt: String
});

module.exports = mongoose.model('Hotel', hotelSchema);
