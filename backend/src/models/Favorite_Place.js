const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "FavoritePlace",
  tableName: "favorite_places",
  columns: {
    id: { primary: true, type: "int", generated: true },
    user_id: { type: "int" },
    place_id: { type: "int" },
    created_at: { type: "timestamp", default: () => "CURRENT_TIMESTAMP" },
  },
  uniques: [{ columns: ["user_id", "place_id"] }]
});