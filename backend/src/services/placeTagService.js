const placeTagRepo = AppDataSource.getRepository("PlaceTag");

module.exports = {
  findAll: () => placeTagRepo.find(),
  findById: (id) => placeTagRepo.findOneBy({ id }),
  create: (data) => placeTagRepo.save(placeTagRepo.create(data)),
  update: async (id, data) => { await placeTagRepo.update(id, data); return placeTagRepo.findOneBy({ id }); },
  remove: (id) => placeTagRepo.delete(id),
};