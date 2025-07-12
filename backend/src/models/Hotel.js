const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Hotel",
  tableName: "hotels",
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
    price_range: { type: "varchar", length: 50 }, // e.g., "$", "$$", "$$$", "$$$$"
    min_price: { type: "float", default: 0 },
    max_price: { type: "float", default: 0 },
    amenities: { type: "text" }, // JSON string of amenities
    room_types: { type: "text" }, // JSON string of available room types
    check_in_time: { type: "varchar", length: 10, default: "15:00" },
    check_out_time: { type: "varchar", length: 10, default: "11:00" },
    stars: { type: "int", default: 0 }, // Hotel star rating (1-5)
    is_active: { type: "boolean", default: true },
    created_at: { type: "timestamp", default: () => "CURRENT_TIMESTAMP" },
    updated_at: { type: "timestamp", default: () => "CURRENT_TIMESTAMP" },
  },
  relations: {
    images: {
      type: "one-to-many",
      target: "HotelImage",
      inverseSide: "hotel"
    }
  }
}); 