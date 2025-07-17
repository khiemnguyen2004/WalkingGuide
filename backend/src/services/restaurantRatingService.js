const { AppDataSource } = require("../data-source");
const RestaurantRating = require("../models/RestaurantRating");

const rateRestaurant = async (user_id, restaurant_id, rating) => {
  const repo = AppDataSource.getRepository(RestaurantRating);
  let existing = await repo.findOne({ where: { user_id, restaurant_id } });
  if (existing) {
    existing.rating = rating;
    await repo.save(existing);
  } else {
    await repo.save({ user_id, restaurant_id, rating });
  }
};

const getRestaurantAverageRating = async (restaurant_id) => {
  const repo = AppDataSource.getRepository(RestaurantRating);
  const ratings = await repo.find({ where: { restaurant_id } });
  if (!ratings.length) return 0;
  return ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
};

const getUserRestaurantRating = async (user_id, restaurant_id) => {
  const repo = AppDataSource.getRepository(RestaurantRating);
  const rating = await repo.findOne({ where: { user_id, restaurant_id } });
  return rating ? rating.rating : null;
};

module.exports = {
  rateRestaurant,
  getRestaurantAverageRating,
  getUserRestaurantRating,
}; 