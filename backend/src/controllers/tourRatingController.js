const tourRatingService = require("../services/tourRatingService");

exports.rateTour = async (req, res) => {
  const user_id = req.user.id;
  const { tour_id, rating } = req.body;
  await tourRatingService.rateTour(user_id, tour_id, rating);
  res.json({ success: true });
};

exports.getTourAverageRating = async (req, res) => {
  const { tour_id } = req.query;
  let average = 0;
  try {
    average = await tourRatingService.getTourAverageRating(tour_id);
  } catch (e) {
    average = 0;
  }
  res.json({ average });
};

exports.getUserTourRating = async (req, res) => {
  const user_id = req.user.id;
  const { tour_id } = req.query;
  let rating = 0;
  try {
    const found = await tourRatingService.getUserTourRating(user_id, tour_id);
    rating = found || 0;
  } catch (e) {
    rating = 0;
  }
  res.json({ rating });
}; 