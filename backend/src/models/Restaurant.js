const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Restaurant",
  tableName: "restaurants",
  columns: {
    id: { primary: true, type: "int", generated: true },
    name: { type: "varchar", length: 255, nullable: false },
    description: { type: "text" },
    latitude: { type: "float", nullable: false },
    longitude: { type: "float", nullable: false },
    rating: { type: "float", default: 0 },
    city: { type: "varchar", length: 255 },
    address: { type: "varchar", length: 500 },
    phone: { type: "varchar", length: 50 },
    email: { type: "varchar", length: 255 },
    website: { type: "varchar", length: 500 },
    cuisine_type: { type: "varchar", length: 255 }, // e.g., "Italian", "Vietnamese", "Seafood"
    price_range: { type: "varchar", length: 50 }, // e.g., "$", "$$", "$$$", "$$$$"
    min_price: { type: "float", default: 0 },
    max_price: { type: "float", default: 0 },
    opening_hours: { type: "text" }, // JSON string of opening hours
    delivery_available: { type: "boolean", default: false },
    takeout_available: { type: "boolean", default: true },
    dine_in_available: { type: "boolean", default: true },
    dietary_options: { type: "text" }, // JSON string of dietary options (vegetarian, vegan, gluten-free, etc.)
    features: { type: "text" }, // JSON string of features (outdoor seating, live music, etc.)
    is_active: { type: "boolean", default: true },
    created_at: { type: "timestamp", default: () => "CURRENT_TIMESTAMP" },
    updated_at: { type: "timestamp", default: () => "CURRENT_TIMESTAMP" },
  },
  relations: {
    images: {
      type: "one-to-many",
      target: "RestaurantImage",
      inverseSide: "restaurant"
    }
  }
}); 