const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Tag",
  tableName: "tags",
  columns: {
    id: { primary: true, type: "int", generated: true },
    name: { type: "varchar", length: 100, nullable: false, unique: true },
    created_at: { type: "timestamp", default: () => "CURRENT_TIMESTAMP" },
  }
});