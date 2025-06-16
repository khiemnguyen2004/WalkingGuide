// src/services/userService.js
const AppDataSource = require("../data-source");
const userRepo = AppDataSource.getRepository("User");

module.exports = {
  findAll: () => userRepo.find(),
  findById: (id) => userRepo.findOneBy({ id }),
  create: (data) => userRepo.save(userRepo.create(data)),
  update: async (id, data) => {
    await userRepo.update(id, data);
    return userRepo.findOneBy({ id });
  },
  remove: (id) => userRepo.delete(id),
};
