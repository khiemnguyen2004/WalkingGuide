const { AppDataSource } = require("../data-source");

module.exports = {
  findAll: () => AppDataSource.getRepository("Comment").find(),
  findById: (id) => AppDataSource.getRepository("Comment").findOneBy({ id }),
  findByPlaceId: async (place_id) => {
    return await AppDataSource
      .getRepository("Comment")
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
  create: (data) => AppDataSource.getRepository("Comment").save(AppDataSource.getRepository("Comment").create(data)),
  update: async (id, data) => { await AppDataSource.getRepository("Comment").update(id, data); return AppDataSource.getRepository("Comment").findOneBy({ id }); },
  remove: (id) => AppDataSource.getRepository("Comment").delete(id),
};
