const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "ArticleComment",
  tableName: "article_comments",
  columns: {
    id: { primary: true, type: "int", generated: true },
    user_id: { type: "int" },
    article_id: { type: "int" },
    content: { type: "text" },
    created_at: { type: "timestamp", default: () => "CURRENT_TIMESTAMP" },
  }
});
