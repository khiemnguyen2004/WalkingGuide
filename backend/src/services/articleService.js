const AppDataSource = require("../data-source");
const articleRepo = AppDataSource.getRepository("Article");

module.exports = {
  findAll: () => articleRepo.find(),
  findById: (id) => articleRepo.findOneBy({ id }),
  create: (data) => articleRepo.save(articleRepo.create(data)),
  update: async (id, data) => { await articleRepo.update(id, data); return articleRepo.findOneBy({ id }); },
  remove: (id) => articleRepo.delete(id),
};
