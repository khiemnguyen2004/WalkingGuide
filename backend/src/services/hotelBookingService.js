const AppDataSource = require("../data-source");
function getRepo() {
  return AppDataSource.getRepository("HotelBooking");
}

module.exports = {
  create: (data) => getRepo().save(getRepo().create(data)),
  findByUserId: (userId) => getRepo().find({ where: { user_id: userId }, order: { created_at: 'DESC' } }),
  findById: (id) => getRepo().findOne({ where: { id } }),
  delete: (id) => getRepo().delete({ id })
}; 