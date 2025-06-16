const tourRepo = AppDataSource.getRepository("Tour");

module.exports = {
  findAll: () => tourRepo.find(),
  findById: (id) => tourRepo.findOneBy({ id }),
  create: (data) => tourRepo.save(tourRepo.create(data)),
  update: async (id, data) => { await tourRepo.update(id, data); return tourRepo.findOneBy({ id }); },
  remove: (id) => tourRepo.delete(id),
};