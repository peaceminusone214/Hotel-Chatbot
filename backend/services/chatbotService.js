const Hotel = require("../models/Hotel");
const Room = require("../models/Room");

exports.getHotelAndRooms = async (platform, pageOrCode) => {
  let hotel;

  if (platform === "facebook" || platform === "zalo") {
    const queryField = platform === "facebook" ? "fb_page_id" : "zalo_oa_id";
    hotel = await Hotel.findOne({ [queryField]: pageOrCode });
  } else {
    hotel = await Hotel.findOne({ hotelCode: pageOrCode });
  }

  if (!hotel) {
    return { error: "Không tìm thấy khách sạn", hotel: null, rooms: [] };
  }

  const rooms = await Room.find({ hotelCode: hotel.hotelCode });
  return { hotel, rooms };
};
