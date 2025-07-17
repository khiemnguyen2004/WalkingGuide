const restaurantRatingService = require("../services/restaurantRatingService");

exports.rateRestaurant = async (req, res) => {
  const user_id = req.user.id;
  const { restaurant_id, rating } = req.body;
  await restaurantRatingService.rateRestaurant(user_id, restaurant_id, rating);
  res.json({ success: true });
};

exports.getRestaurantAverageRating = async (req, res) => {
  const { restaurant_id } = req.query;
  const avg = await restaurantRatingService.getRestaurantAverageRating(restaurant_id);
  res.json({ average: avg });
};

exports.getUserRestaurantRating = async (req, res) => {
  const user_id = req.user.id;
  const { restaurant_id } = req.query;
  const rating = await restaurantRatingService.getUserRestaurantRating(user_id, restaurant_id);
  res.json({ rating });
}; 