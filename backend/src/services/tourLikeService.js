const { AppDataSource } = require("../data-source");
const TourLike = require("../models/TourLike");

const likeTour = async (user_id, tour_id) => {
  const repo = AppDataSource.getRepository(TourLike);
  const existing = await repo.findOne({ where: { user_id, tour_id } });
  if (!existing) {
    await repo.save({ user_id, tour_id });
  }
};

const unlikeTour = async (user_id, tour_id) => {
  const repo = AppDataSource.getRepository(TourLike);
  await repo.delete({ user_id, tour_id });
};

const isTourLiked = async (user_id, tour_id) => {
  const repo = AppDataSource.getRepository(TourLike);
  return !!(await repo.findOne({ where: { user_id, tour_id } }));
};

const countTourLikes = async (tour_id) => {
  const repo = AppDataSource.getRepository(TourLike);
  return await repo.count({ where: { tour_id } });
};

module.exports = {
  likeTour,
  unlikeTour,
  isTourLiked,
  countTourLikes,
}; 