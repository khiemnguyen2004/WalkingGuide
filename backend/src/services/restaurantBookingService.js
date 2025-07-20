const AppDataSource = require("../data-source");
function getRepo() {
  return AppDataSource.getRepository("RestaurantBooking");
}

module.exports = {
  create: (data) => getRepo().save(getRepo().create(data)),
  findByUserId: (userId) => getRepo().find({ where: { user_id: userId }, order: { created_at: 'DESC' } }),
  findByRestaurantId: (restaurantId) => getRepo().find({ where: { restaurant_id: restaurantId }, order: { created_at: 'DESC' } }),
  findAll: () => getRepo().find({ order: { created_at: 'DESC' } }),
  updateStatus: async (id, status) => {
    await getRepo().update(id, { status });
    return getRepo().findOneBy({ id });
  },
}; 