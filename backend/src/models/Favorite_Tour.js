const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "FavoriteTour",
  tableName: "favorite_tours",
  columns: {
    id: { primary: true, type: "int", generated: true },
    user_id: { type: "int" },
    tour_id: { type: "int" },
    created_at: { type: "timestamp", createDate: true, default: () => "CURRENT_TIMESTAMP" }
  },
  uniques: [
    { columns: ["user_id", "tour_id"] }
  ]
});