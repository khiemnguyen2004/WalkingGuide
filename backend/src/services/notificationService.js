const AppDataSource = require("../data-source");
const notiRepo = AppDataSource.getRepository("Notification");

module.exports = {
  findAll: () => notiRepo.find(),
  findById: (id) => notiRepo.findOneBy({ id }),
  create: (data) => notiRepo.save(notiRepo.create(data)),
  update: async (id, data) => { await notiRepo.update(id, data); return notiRepo.findOneBy({ id }); },
  remove: (id) => notiRepo.delete(id),
};
