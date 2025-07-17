const hotelRatingService = require("../services/hotelRatingService");

exports.rateHotel = async (req, res) => {
  const user_id = req.user.id;
  const { hotel_id, rating } = req.body;
  await hotelRatingService.rateHotel(user_id, hotel_id, rating);
  res.json({ success: true });
};

exports.getHotelAverageRating = async (req, res) => {
  const { hotel_id } = req.query;
  const avg = await hotelRatingService.getHotelAverageRating(hotel_id);
  res.json({ average: avg });
};

exports.getUserHotelRating = async (req, res) => {
  const user_id = req.user.id;
  const { hotel_id } = req.query;
  const rating = await hotelRatingService.getUserHotelRating(user_id, hotel_id);
  res.json({ rating });
}; 