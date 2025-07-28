const ChatContext = require("../models/ChatContext");
const { summarize } = require("./gptService");

// ✅ Lấy bản tóm tắt hiện tại
exports.getContextSummary = async ({ platform, page_id, sender_id }) => {
  const ctx = await ChatContext.findOne({ platform, page_id, sender_id });
  return ctx?.summary || "";
};

// ✅ Cập nhật bản tóm tắt sau mỗi lượt chat
exports.updateContextSummary = async ({ hotelCode, platform, page_id, sender_id, message, reply }) => {
  const identifier = { platform, page_id, sender_id };

  const current = await ChatContext.findOne(identifier);
  const prevSummary = current?.summary || "";

  const newSummary = await summarize(prevSummary, message, reply); // gọi GPT

  if (current) {
    current.summary = newSummary;
    await current.save();
  } else {
    await ChatContext.create({ hotelCode, ...identifier, summary: newSummary });
  }
};
