const Hotel = require('../models/Hotel');
const Room = require('../models/Room');
const { getGPTReply } = require('../services/gptService');

exports.handleMessage = async (req, res) => {
  try {
    const { message, sender_id, platform, page_id } = req.body;

    // 1. Xác định khách sạn từ page_id / zalo_oa_id
    const hotel = await Hotel.findOne(platform === 'facebook'
      ? { fb_page_id: page_id }
      : { zalo_oa_id: page_id }
    );

    if (!hotel) return res.status(404).json({ message: 'Khách sạn không tồn tại' });

    // 2. Lấy danh sách phòng
    const rooms = await Room.find({ hotelCode: hotel.hotelCode });

    // 3. Gửi prompt đến GPT
    const reply = await getGPTReply(hotel, rooms, message);

    // 4. Trả lại kết quả (chỗ này bạn sẽ gửi lại FB/Zalo thực tế sau)
    return res.json({
      reply,
      hotel: hotel.name,
    });
  } catch (err) {
    console.error("chatbotController error:", err);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
