const { AppDataSource } = require("../data-source");
const PlaceLike = require("../models/PlaceLike");

const likePlace = async (user_id, place_id) => {
  const repo = AppDataSource.getRepository(PlaceLike);
  const existing = await repo.findOne({ where: { user_id, place_id } });
  if (!existing) {
    await repo.save({ user_id, place_id });
  }
};

const unlikePlace = async (user_id, place_id) => {
  const repo = AppDataSource.getRepository(PlaceLike);
  await repo.delete({ user_id, place_id });
};

const isPlaceLiked = async (user_id, place_id) => {
  const repo = AppDataSource.getRepository(PlaceLike);
  return !!(await repo.findOne({ where: { user_id, place_id } }));
};

const countPlaceLikes = async (place_id) => {
  const repo = AppDataSource.getRepository(PlaceLike);
  return await repo.count({ where: { place_id } });
};

module.exports = {
  likePlace,
  unlikePlace,
  isPlaceLiked,
  countPlaceLikes,
}; 