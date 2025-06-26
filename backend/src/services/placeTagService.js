const { AppDataSource } = require("../data-source");
const repo = () => AppDataSource.getRepository("PlaceTag");

module.exports = {
  findAll: () => repo().find(),
  create: (data) => repo().save(repo().create(data)),
  remove: ({ place_id, tag_id }) =>
    repo().delete({ place_id, tag_id }),
};
