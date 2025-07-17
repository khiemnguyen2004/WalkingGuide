const { AppDataSource } = require("../data-source");
const repo = AppDataSource.getRepository("RestaurantBooking");

module.exports = {
  create: (data) => repo.save(repo.create(data)),
  findByUserId: (userId) => repo.find({ where: { user_id: userId }, order: { created_at: 'DESC' } }),
  findByRestaurantId: (restaurantId) => repo.find({ where: { restaurant_id: restaurantId }, order: { created_at: 'DESC' } }),
  findAll: () => repo.find({ order: { created_at: 'DESC' } }),
  updateStatus: async (id, status) => {
    await repo.update(id, { status });
    return repo.findOneBy({ id });
  },
}; 