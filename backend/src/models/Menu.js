const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Menu",
  tableName: "menus",
  columns: {
    id: { primary: true, type: "int", generated: true },
    restaurant_id: { type: "int" },
    name: { type: "varchar", length: 255, nullable: false },
    description: { type: "text", nullable: true },
    created_at: { type: "timestamp", default: () => "CURRENT_TIMESTAMP" },
    updated_at: { type: "timestamp", default: () => "CURRENT_TIMESTAMP" },
  },
}); 