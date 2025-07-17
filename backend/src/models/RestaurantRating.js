const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "RestaurantRating",
  tableName: "restaurant_ratings",
  columns: {
    id: { primary: true, type: "int", generated: true },
    user_id: { type: "int" },
    restaurant_id: { type: "int" },
    rating: { type: "int" },
    created_at: { type: "timestamp", default: () => "CURRENT_TIMESTAMP" },
  },
  uniques: [{ columns: ["user_id", "restaurant_id"] }]
}); 