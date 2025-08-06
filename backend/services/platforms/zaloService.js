const Hotel = require("../../models/Hotel");
const Room = require("../../models/Room");
const { getGPTReply } = require("../gptService");
const {
  getContextSummary,
  updateContextSummary,
} = require("../chatContextService");

async function handleZaloMessage({ hotelCode, platform, page_id, sender_id, message }) {
  if (!hotelCode || !platform || !page_id || !sender_id || !message) {
    return { error: "Missing required fields", code: 400 };
  }

  const hotel = await Hotel.findOne({ hotelCode });
  if (!hotel) {
    return { error: "Hotel not found", code: 404 };
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

  return { reply };
}

module.exports = {
  handleZaloMessage,
};
