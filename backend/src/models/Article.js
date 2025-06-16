const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Article",
  tableName: "articles",
  columns: {
    article_id: { primary: true, type: "int", generated: true },
    admin_id: { type: "int" },
    title: { type: "varchar", length: 255, nullable: false },
    content: { type: "text" },
    image_url: { type: "varchar", length: 255 },
    published_at: { type: "timestamp", default: () => "CURRENT_TIMESTAMP" },
    updated_at: { type: "timestamp", default: () => "CURRENT_TIMESTAMP" },
  }
});