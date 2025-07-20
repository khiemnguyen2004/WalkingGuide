const AppDataSource = require("../data-source");
function getFavoriteRepo() {
  return AppDataSource.getRepository("FavoritePlace");
}

module.exports = {
  findAll: () => getFavoriteRepo().find(),
  findById: (id) => getFavoriteRepo().findOneBy({ id }),
  create: (data) => getFavoriteRepo().save(getFavoriteRepo().create(data)),
  update: async (id, data) => { await getFavoriteRepo().update(id, data); return getFavoriteRepo().findOneBy({ id }); },
  remove: (id) => getFavoriteRepo().delete(id),
};
