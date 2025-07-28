const Hotel = require("../models/Hotel");
const Room = require("../models/Room");
const { getGPTReply } = require("../services/gptService");
const {
  getContextSummary,
  updateContextSummary,
} = require("../services/chatContextService");

exports.handleMessage = async (req, res) => {
  try {
    const { hotelCode, platform, page_id, sender_id, message } = req.body;

    if (!hotelCode || !platform || !page_id || !sender_id || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const hotel = await Hotel.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ error: "Hotel not found" });
    }

    const rooms = await Room.find({ hotelCode });

    const contextSummary = await getContextSummary({ platform, page_id, sender_id });

    const reply = await getGPTReply(hotel, rooms, message, contextSummary);

    await updateContextSummary({
      hotelCode,
      platform,
      page_id,
      sender_id,
      message,
      reply,
    });

    return res.json({ reply });
  } catch (err) {
    console.error("Error handling message:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// testMessage cho dùng thử (nếu thiếu platform/page_id vẫn chạy)
exports.testMessage = async (req, res) => {
  const { hotelCode, platform, page_id, sender_id, message } = req.body;

  if (!hotelCode || !message) {
    return res.status(400).json({ error: "Missing hotelCode or message" });
  }

  try {
    const hotel = await Hotel.findOne({ hotelCode });
    if (!hotel) return res.status(404).json({ error: "Hotel not found" });

    const rooms = await Room.find({ hotelCode });

    let contextSummary = "";
    if (platform && page_id && sender_id) {
      contextSummary = await getContextSummary({ platform, page_id, sender_id });
    }

    const reply = await getGPTReply(hotel, rooms, message, contextSummary);

    if (platform && page_id && sender_id) {
      await updateContextSummary({ hotelCode, platform, page_id, sender_id, message, reply });
    }

    return res.json({ reply });
  } catch (err) {
    console.error("Lỗi testMessage:", err);
    return res.status(500).json({ error: "Lỗi server" });
  }
};