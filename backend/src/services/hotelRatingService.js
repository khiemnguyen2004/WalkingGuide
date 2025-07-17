const { AppDataSource } = require("../data-source");
const HotelRating = require("../models/HotelRating");

const rateHotel = async (user_id, hotel_id, rating) => {
  const repo = AppDataSource.getRepository(HotelRating);
  let existing = await repo.findOne({ where: { user_id, hotel_id } });
  if (existing) {
    existing.rating = rating;
    await repo.save(existing);
  } else {
    await repo.save({ user_id, hotel_id, rating });
  }
};

const getHotelAverageRating = async (hotel_id) => {
  const repo = AppDataSource.getRepository(HotelRating);
  const ratings = await repo.find({ where: { hotel_id } });
  if (!ratings.length) return 0;
  return ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
};

const getUserHotelRating = async (user_id, hotel_id) => {
  const repo = AppDataSource.getRepository(HotelRating);
  const rating = await repo.findOne({ where: { user_id, hotel_id } });
  return rating ? rating.rating : null;
};

module.exports = {
  rateHotel,
  getHotelAverageRating,
  getUserHotelRating,
}; 