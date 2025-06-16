const AppDataSource = require("../data-source");
const tagRepo = AppDataSource.getRepository("Tag");

module.exports = {
  findAll: () => tagRepo.find(),
  findById: (id) => tagRepo.findOneBy({ id }),
  create: (data) => tagRepo.save(tagRepo.create(data)),
  update: async (id, data) => { await tagRepo.update(id, data); return tagRepo.findOneBy({ id }); },
  remove: (id) => tagRepo.delete(id),
};