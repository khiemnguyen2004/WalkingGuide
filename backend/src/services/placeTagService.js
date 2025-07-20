const AppDataSource = require("../data-source");
function getRepo() {
  return AppDataSource.getRepository("PlaceTag");
}

module.exports = {
  findAll: () => getRepo().find(),
  create: (data) => getRepo().save(getRepo().create(data)),
  remove: ({ place_id, tag_id }) =>
    getRepo().delete({ place_id, tag_id }),
};
