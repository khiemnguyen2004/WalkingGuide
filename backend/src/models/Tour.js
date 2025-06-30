const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Tour",
  tableName: "tours",
  columns: {
    id: { primary: true, type: "int", generated: true },
    user_id: { type: "int" },
    name: { type: "varchar", length: 255, nullable: false },
    description: { type: "text" },
    image_url: { type: "varchar", length: 500, nullable: true },
    total_cost: { type: "float", default: 0 },
    created_at: { type: "timestamp", default: () => "CURRENT_TIMESTAMP" },
    updated_at: { type: "timestamp", default: () => "CURRENT_TIMESTAMP" },
    start_time: { type: "date", nullable: true },
    end_time: { type: "date", nullable: true },
  }
});