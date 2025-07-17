const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "RestaurantBooking",
  tableName: "restaurant_bookings",
  columns: {
    id: { primary: true, type: "int", generated: true },
    user_id: { type: "int" },
    restaurant_id: { type: "int" },
    booking_time: { type: "timestamp", nullable: false },
    number_of_people: { type: "int", default: 1 },
    special_requests: { type: "text", nullable: true },
    status: { type: "varchar", length: 20, default: "pending" }, // pending, confirmed, cancelled
    created_at: { type: "timestamp", default: () => "CURRENT_TIMESTAMP" },
  },
}); 