const { AppDataSource } = require("../data-source");

const getTagRepo = () => AppDataSource.getRepository("Tag");

module.exports = {
  findAll: () => getTagRepo().find(),
  findById: (id) => getTagRepo().findOneBy({ id }),
  create: (data) => getTagRepo().save(getTagRepo().create(data)),
  update: async (id, data) => {
    await getTagRepo().update(id, data);
    return getTagRepo().findOneBy({ id });
  },
  remove: (id) => getTagRepo().delete(id),
};
