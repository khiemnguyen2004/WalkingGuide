const AppDataSource = require("../data-source");
const Place = require("../models/Place");

const placeRepository = AppDataSource.getRepository("Place");

module.exports = {
  async create(data) {
    const place = placeRepository.create(data);
    return await placeRepository.save(place);
  },

  async findAll() {
    return await placeRepository.find();
  },

  async findById(id) {
    return await placeRepository.findOneBy({ id });
  },

  async update(id, data) {
    await placeRepository.update(id, data);
    return await placeRepository.findOneBy({ id });
  },

  async delete(id) {
    return await placeRepository.delete(id);
  },
};
