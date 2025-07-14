const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "ArticleReport",
  tableName: "article_reports",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    article_id: {
      type: "int",
    },
    user_id: {
      type: "int",
    },
    reason: {
      type: "text",
    },
    status: {
      type: "varchar",
      default: "pending",
    },
    created_at: {
      type: "timestamp",
      createDate: true,
      default: () => "CURRENT_TIMESTAMP",
    },
  },
}); 