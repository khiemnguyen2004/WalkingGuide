const AppDataSource = require("../data-source");
const Place = require("../models/Place");

function getPlaceRepository() {
  return AppDataSource.getRepository("Place");
}

module.exports = {
  async create(data) {
    const placeRepository = getPlaceRepository();
    const place = placeRepository.create(data);
    return await placeRepository.save(place);
  },

  async findAll() {
    const placeRepository = getPlaceRepository();
    return await placeRepository.find();
  },

  async findById(id) {
    const placeRepository = getPlaceRepository();
    return await placeRepository.findOneBy({ id });
  },

  async findByCity(city) {
    const placeRepository = getPlaceRepository();
    return await placeRepository
      .createQueryBuilder("place")
      .where("LOWER(TRIM(place.city)) LIKE LOWER(:city)", { 
        city: `%${city.toLowerCase().trim()}%` 
      })
      .getMany();
  },

  async update(id, data) {
    const placeRepository = getPlaceRepository();
    await placeRepository.update(id, data);
    return await placeRepository.findOneBy({ id });
  },

  async delete(id) {
    const placeRepository = getPlaceRepository();
    return await placeRepository.delete(id);
  },
};
