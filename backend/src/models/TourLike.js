const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "TourLike",
  tableName: "tour_likes",
  columns: {
    id: { primary: true, type: "int", generated: true },
    user_id: { type: "int" },
    tour_id: { type: "int" },
    created_at: { type: "timestamp", default: () => "CURRENT_TIMESTAMP" },
  },
  uniques: [{ columns: ["user_id", "tour_id"] }]
}); 