const AppDataSource = require("../data-source");
const TourRating = require("../models/TourRating");

function getRepo() {
  return AppDataSource.getRepository(TourRating);
}

const rateTour = async (user_id, tour_id, rating) => {
  const repo = getRepo();
  let existing = await repo.findOne({ where: { user_id, tour_id } });
  if (existing) {
    existing.rating = rating;
    await repo.save(existing);
  } else {
    await repo.save({ user_id, tour_id, rating });
  }
};

const getTourAverageRating = async (tour_id) => {
  const repo = getRepo();
  const ratings = await repo.find({ where: { tour_id } });
  if (!ratings.length) return 0;
  return ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
};

const getUserTourRating = async (user_id, tour_id) => {
  const repo = getRepo();
  const rating = await repo.findOne({ where: { user_id, tour_id } });
  return rating ? rating.rating : null;
};

module.exports = {
  rateTour,
  getTourAverageRating,
  getUserTourRating,
}; 