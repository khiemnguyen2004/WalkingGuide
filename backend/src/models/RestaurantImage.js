const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "RestaurantImage",
  tableName: "restaurant_images",
  columns: {
    id: { primary: true, type: "int", generated: true },
    restaurant_id: { type: "int", nullable: false },
    image_url: { type: "varchar", length: 500, nullable: false },
    caption: { type: "varchar", length: 255 },
    is_primary: { type: "boolean", default: false }, // Mark as primary/featured image
    sort_order: { type: "int", default: 0 }, // For ordering images
    created_at: { type: "timestamp", default: () => "CURRENT_TIMESTAMP" },
  },
  relations: {
    restaurant: {
      type: "many-to-one",
      target: "Restaurant",
      joinColumn: { name: "restaurant_id" },
      onDelete: "CASCADE"
    }
  }
}); 