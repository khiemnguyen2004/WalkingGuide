const { AppDataSource } = require("../data-source");

module.exports = {
  findAll: async () => {
    const userRepo = AppDataSource.getRepository("User");
    return await userRepo.find();
  },
  findById: async (id) => {
    const userRepo = AppDataSource.getRepository("User");
    return await userRepo.findOneBy({ id });
  },
  create: async (data) => {
    const userRepo = AppDataSource.getRepository("User");
    return await userRepo.save(userRepo.create(data));
  },
  update: async (id, data) => {
    const userRepo = AppDataSource.getRepository("User");
    await userRepo.update(id, data);
    return await userRepo.findOneBy({ id });
  },
  remove: async (id) => {
    const userRepo = AppDataSource.getRepository("User");
    return await userRepo.delete(id);
  },
};
