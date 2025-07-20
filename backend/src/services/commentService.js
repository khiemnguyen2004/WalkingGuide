const AppDataSource = require("../data-source");
function getCommentRepo() {
  return AppDataSource.getRepository("Comment");
}

module.exports = {
  findAll: () => getCommentRepo().find(),
  findById: (id) => getCommentRepo().findOneBy({ id }),
  findByPlaceId: async (place_id) => {
    return await getCommentRepo()
      .createQueryBuilder("comment")
      .leftJoin("users", "user", "user.id = comment.user_id")
      .addSelect("user.full_name", "user_full_name")
      .where("comment.place_id = :place_id", { place_id })
      .select([
        "comment.id",
        "comment.user_id",
        "comment.place_id",
        "comment.content",
        "comment.rating",
        "comment.created_at",
        "user.full_name"
      ])
      .getRawMany();
  },
  create: (data) => getCommentRepo().save(getCommentRepo().create(data)),
  update: async (id, data) => { await getCommentRepo().update(id, data); return getCommentRepo().findOneBy({ id }); },
  remove: (id) => getCommentRepo().delete(id),
};
