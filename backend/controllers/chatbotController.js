const zaloService = require("../services/platforms/zaloService");
const facebookService = require("../services/platforms/facebookService");

exports.handleMessage = async (req, res) => {
  try {
    const { hotelCode, platform, page_id, sender_id, message } = req.body;

    if (!hotelCode || !platform || !page_id || !sender_id || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let result;

    switch (platform) {
      case "zalo":
        result = await zaloService.handleZaloMessage({ hotelCode, platform, page_id, sender_id, message });
        break;
      case "facebook":
        result = await facebookService.handleFacebookMessage({ hotelCode, platform, page_id, sender_id, message });
        break;
      default:
        return res.status(400).json({ error: "Unsupported platform" });
    }

    if (result?.error) {
      return res.status(result.code || 500).json({ error: result.error });
    }

    return res.json({ reply: result.reply });
  } catch (err) {
    console.error("Error handling message:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.testMessage = async (req, res) => {
  const { hotelCode, platform, page_id, sender_id, message } = req.body;

  if (!hotelCode || !message) {
    return res.status(400).json({ error: "Missing hotelCode or message" });
  }

  try {
    const Hotel = require("../models/Hotel");
    const Room = require("../models/Room");
    const { getGPTReply } = require("../services/gptService");
    const {
      getContextSummary,
      updateContextSummary,
    } = require("../services/chatContextService");

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
