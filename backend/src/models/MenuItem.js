const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "MenuItem",
  tableName: "menu_items",
  columns: {
    id: { primary: true, type: "int", generated: true },
    menu_id: { type: "int" },
    name: { type: "varchar", length: 255, nullable: false },
    price: { type: "float", default: 0 },
    description: { type: "text", nullable: true },
    image_url: { type: "varchar", length: 500, nullable: true },
    created_at: { type: "timestamp", default: () => "CURRENT_TIMESTAMP" },
    updated_at: { type: "timestamp", default: () => "CURRENT_TIMESTAMP" },
  },
}); 