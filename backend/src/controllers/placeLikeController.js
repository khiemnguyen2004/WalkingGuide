const placeLikeService = require("../services/placeLikeService");

exports.likePlace = async (req, res) => {
  const user_id = req.user.id;
  const { place_id } = req.body;
  await placeLikeService.likePlace(user_id, place_id);
  res.json({ success: true });
};

exports.unlikePlace = async (req, res) => {
  const user_id = req.user.id;
  const { place_id } = req.body;
  await placeLikeService.unlikePlace(user_id, place_id);
  res.json({ success: true });
};

exports.isPlaceLiked = async (req, res) => {
  const user_id = req.user.id;
  const { place_id } = req.query;
  const liked = await placeLikeService.isPlaceLiked(user_id, place_id);
  res.json({ liked });
};

exports.countPlaceLikes = async (req, res) => {
  const { place_id } = req.query;
  const count = await placeLikeService.countPlaceLikes(place_id);
  res.json({ count });
}; 