const tourLikeService = require("../services/tourLikeService");

exports.likeTour = async (req, res) => {
  const user_id = req.user.id;
  const { tour_id } = req.body;
  await tourLikeService.likeTour(user_id, tour_id);
  res.json({ success: true });
};

exports.unlikeTour = async (req, res) => {
  const user_id = req.user.id;
  const { tour_id } = req.body;
  await tourLikeService.unlikeTour(user_id, tour_id);
  res.json({ success: true });
};

exports.isTourLiked = async (req, res) => {
  const user_id = req.user.id;
  const { tour_id } = req.query;
  let liked = false;
  try {
    liked = await tourLikeService.isTourLiked(user_id, tour_id);
  } catch (e) {
    liked = false;
  }
  res.json({ liked });
};

exports.countTourLikes = async (req, res) => {
  const { tour_id } = req.query;
  let count = 0;
  try {
    count = await tourLikeService.countTourLikes(tour_id);
  } catch (e) {
    count = 0;
  }
  res.json({ count });
}; 