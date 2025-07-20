const AppDataSource = require("../data-source");
function getArticleRepo() {
  return AppDataSource.getRepository("Article");
}

module.exports = {
  findAll: () => getArticleRepo().find(),
  findById: (id) => getArticleRepo().findOneBy({ id }),
  create: (data) => getArticleRepo().save(getArticleRepo().create(data)),
  update: async (id, data) => { await getArticleRepo().update(id, data); return getArticleRepo().findOneBy({ id }); },
  remove: (id) => getArticleRepo().delete(id),
};
