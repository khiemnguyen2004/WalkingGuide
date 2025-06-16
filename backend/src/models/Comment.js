const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Comment",
  tableName: "comments",
  columns: {
    id: { primary: true, type: "int", generated: true },
    user_id: { type: "int" },
    place_id: { type: "int" },
    content: { type: "text" },
    rating: { type: "int" },
    created_at: { type: "timestamp", default: () => "CURRENT_TIMESTAMP" },
  }
});