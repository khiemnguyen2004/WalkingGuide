const AppDataSource = require("../data-source");
function getTourStepRepo() {
  return AppDataSource.getRepository("TourStep");
}

module.exports = {
  findAll: () => getTourStepRepo().find(),
  findById: (id) => getTourStepRepo().findOneBy({ id }),
  create: (data) => getTourStepRepo().save(getTourStepRepo().create(data)),
  update: async (id, data) => { await getTourStepRepo().update(id, data); return getTourStepRepo().findOneBy({ id }); },
  remove: (id) => getTourStepRepo().delete(id),
};