const placeRatingService = require("../services/placeRatingService");

exports.ratePlace = async (req, res) => {
  const user_id = req.user.id;
  const { place_id, rating } = req.body;
  await placeRatingService.ratePlace(user_id, place_id, rating);
  res.json({ success: true });
};

exports.getPlaceAverageRating = async (req, res) => {
  const { place_id } = req.query;
  const avg = await placeRatingService.getPlaceAverageRating(place_id);
  res.json({ average: avg });
};

exports.getUserPlaceRating = async (req, res) => {
  const user_id = req.user.id;
  const { place_id } = req.query;
  const rating = await placeRatingService.getUserPlaceRating(user_id, place_id);
  res.json({ rating });
}; 