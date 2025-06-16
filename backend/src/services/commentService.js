const AppDataSource = require("../data-source");
const commentRepo = AppDataSource.getRepository("Comment");

module.exports = {
  findAll: () => commentRepo.find(),
  findById: (id) => commentRepo.findOneBy({ id }),
  create: (data) => commentRepo.save(commentRepo.create(data)),
  update: async (id, data) => { await commentRepo.update(id, data); return commentRepo.findOneBy({ id }); },
  remove: (id) => commentRepo.delete(id),
};
