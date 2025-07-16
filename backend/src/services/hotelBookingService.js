const { AppDataSource } = require("../data-source");
const repo = AppDataSource.getRepository("HotelBooking");
 
module.exports = {
  create: (data) => repo.save(repo.create(data)),
  findByUserId: (userId) => repo.find({ where: { user_id: userId }, order: { created_at: 'DESC' } }),
}; 