const { AppDataSource } = require("../data-source");
const repo = AppDataSource.getRepository("HotelBooking");
 
module.exports = {
  create: (data) => repo.save(repo.create(data)),
  findByUserId: (userId) => repo.find({ where: { user_id: userId }, order: { created_at: 'DESC' } }),
  findById: (id) => repo.findOne({ where: { id } }),
  delete: (id) => repo.delete({ id })
}; 