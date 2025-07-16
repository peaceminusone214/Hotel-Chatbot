const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.getGPTReply = async (hotel, rooms, message) => {
  const roomText = rooms.map(r =>
    `- ${r.name}: ${r.capacity} người, ${r.view}, ${r.price}đ, tiện nghi: ${r.amenities.join(', ')}`
  ).join('\n');

  const prompt = `
Khách sạn: ${hotel.name}
Địa chỉ: ${hotel.address}
Danh sách phòng:
${roomText}

Khách hỏi: "${message}"

Hãy tư vấn phòng phù hợp, lịch sự và gợi ý cụ thể. Nếu không phù hợp, hãy hỏi lại nhu cầu.
`;

  const chatCompletion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }]
  });

  return chatCompletion.choices[0].message.content.trim();
};
