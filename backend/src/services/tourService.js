const AppDataSource = require("../data-source");
function getTourRepo() {
  return AppDataSource.getRepository("Tour");
}

module.exports = {
  findAll: () => getTourRepo().find(),
  findById: (id) => getTourRepo().findOneBy({ id }),
  create: (data) => getTourRepo().save(getTourRepo().create(data)),
  update: async (id, data) => { await getTourRepo().update(id, data); return getTourRepo().findOneBy({ id }); },
  remove: (id) => getTourRepo().delete(id),
};