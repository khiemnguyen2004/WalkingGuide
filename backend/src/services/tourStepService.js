const tourStepRepo = AppDataSource.getRepository("TourStep");

module.exports = {
  findAll: () => tourStepRepo.find(),
  findById: (id) => tourStepRepo.findOneBy({ id }),
  create: (data) => tourStepRepo.save(tourStepRepo.create(data)),
  update: async (id, data) => { await tourStepRepo.update(id, data); return tourStepRepo.findOneBy({ id }); },
  remove: (id) => tourStepRepo.delete(id),
};