const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "HotelBooking",
  tableName: "hotel_bookings",
  columns: {
    id: { primary: true, type: "int", generated: true },
    user_id: { type: "int" },
    hotel_id: { type: "int" },
    tour_id: { type: "int", nullable: true },
    check_in: { type: "date", nullable: false },
    check_out: { type: "date", nullable: false },
    created_at: { type: "timestamp", default: () => "CURRENT_TIMESTAMP" },
  }
}); 