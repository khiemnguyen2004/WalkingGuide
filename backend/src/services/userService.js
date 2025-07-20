const AppDataSource = require("../data-source");
function getUserRepo() {
  return AppDataSource.getRepository("User");
}

module.exports = {
  findAll: async () => {
    const userRepo = getUserRepo();
    return await userRepo.find();
  },
  findById: async (id) => {
    const userRepo = getUserRepo();
    return await userRepo.findOneBy({ id });
  },
  create: async (data) => {
    const userRepo = getUserRepo();
    return await userRepo.save(userRepo.create(data));
  },
  update: async (id, data) => {
    const userRepo = getUserRepo();
    await userRepo.update(id, data);
    return await userRepo.findOneBy({ id });
  },
  remove: async (id) => {
    const userRepo = getUserRepo();
    return await userRepo.delete(id);
  },
};
