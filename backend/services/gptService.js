const { OpenAI } = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.getGPTReply = async (hotel, rooms, message, contextSummary = "") => {
  const roomText = rooms.map(r =>
    `- ${r.name}: ${r.capacity} người, ${r.view}, ${r.price}đ, tiện nghi: ${r.amenities.join(', ')}`
  ).join('\n');

  const systemPrompt = hotel.prompt || `Bạn là lễ tân khách sạn ${hotel.name} tại địa chỉ ${hotel.address}. Luôn tư vấn ngắn gọn, thân thiện và gợi ý phòng phù hợp với nhu cầu khách.`;

  const messages = [
    { role: "system", content: systemPrompt },
    { role: "system", content: `Danh sách phòng:\n${roomText}` },
  ];

  if (contextSummary?.trim()) {
    messages.push({
      role: "system",
      content: `Tóm tắt hội thoại trước đó (để hiểu ngữ cảnh): ${contextSummary}`
    });
  }

  messages.push({ role: "user", content: message });

  const chatCompletion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages,
    max_tokens: 300
  });

  return chatCompletion.choices[0].message.content.trim();
};

// 🔁 TÓM TẮT NGỮ CẢNH
exports.summarize = async (prevSummary, newMessage, newReply) => {
  const messages = [
    {
      role: "system",
      content: "Bạn là AI tóm tắt hội thoại giữa khách hàng và chatbot khách sạn."
    },
    {
      role: "user",
      content: `
Tóm tắt trước đó: "${prevSummary || "(chưa có)"}"
Khách: "${newMessage}"
Chatbot: "${newReply}"

Tóm tắt toàn bộ hội thoại đến hiện tại (ngắn gọn, chỉ nội dung chính):`
    }
  ];

  const summaryResult = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages,
    max_tokens: 150,
  });

  return summaryResult.choices[0].message.content.trim();
};
