const AppDataSource = require("../data-source");
const PlaceRating = require("../models/PlaceRating");

function getRepo() {
  return AppDataSource.getRepository(PlaceRating);
}

const ratePlace = async (user_id, place_id, rating) => {
  const repo = getRepo();
  let existing = await repo.findOne({ where: { user_id, place_id } });
  if (existing) {
    existing.rating = rating;
    await repo.save(existing);
  } else {
    await repo.save({ user_id, place_id, rating });
  }
};

const getPlaceAverageRating = async (place_id) => {
  const repo = getRepo();
  const ratings = await repo.find({ where: { place_id } });
  if (!ratings.length) return 0;
  return ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
};

const getUserPlaceRating = async (user_id, place_id) => {
  const repo = getRepo();
  const rating = await repo.findOne({ where: { user_id, place_id } });
  return rating ? rating.rating : null;
};

module.exports = {
  ratePlace,
  getPlaceAverageRating,
  getUserPlaceRating,
}; 