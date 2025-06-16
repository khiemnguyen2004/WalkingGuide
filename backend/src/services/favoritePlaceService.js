const AppDataSource = require("../data-source");
const favoriteRepo = AppDataSource.getRepository("FavoritePlace");

module.exports = {
  findAll: () => favoriteRepo.find(),
  findById: (id) => favoriteRepo.findOneBy({ id }),
  create: (data) => favoriteRepo.save(favoriteRepo.create(data)),
  update: async (id, data) => { await favoriteRepo.update(id, data); return favoriteRepo.findOneBy({ id }); },
  remove: (id) => favoriteRepo.delete(id),
};
