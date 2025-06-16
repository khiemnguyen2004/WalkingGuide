const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "PlaceTag",
  tableName: "place_tags",
  columns: {
    id: { primary: true, type: "int", generated: true },
    place_id: { type: "int" },
    tag_id: { type: "int" },
  },
  uniques: [{ columns: ["place_id", "tag_id"] }]
});