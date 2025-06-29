const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Place",
  tableName: "places",
  columns: {
    id: { primary: true, type: "int", generated: true },
    name: { type: "varchar", length: 255, nullable: false },
    description: { type: "text" },
    latitude: { type: "float", nullable: false },
    longitude: { type: "float", nullable: false },
    image_url: { type: "varchar", length: 255 },
    rating: { type: "float", default: 0 },
    city: { type: "varchar", length: 255 },
    address: { type: "varchar", length: 500 },
    opening_hours: { type: "text" },
    service: { type: "text" },
    created_at: { type: "timestamp", default: () => "CURRENT_TIMESTAMP" },
    updated_at: { type: "timestamp", default: () => "CURRENT_TIMESTAMP" },
  }
});