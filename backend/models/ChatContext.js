const mongoose = require("mongoose");

const chatContextSchema = new mongoose.Schema({
  hotelCode: String,
  platform: String,
  page_id: String,
  sender_id: String,
  summary: String // ✅ Thêm trường summary
});

chatContextSchema.index(
  { hotelCode: 1, platform: 1, page_id: 1, sender_id: 1 },
  { unique: true }
);

module.exports = mongoose.model("ChatContext", chatContextSchema);
