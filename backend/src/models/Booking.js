const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Booking",
  tableName: "bookings",
  columns: {
    id: { primary: true, type: "int", generated: true },
    user_id: { type: "int" },
    tour_id: { type: "int" },
    start_date: { type: "date", nullable: false },
    end_date: { type: "date", nullable: false },
    created_at: { type: "timestamp", default: () => "CURRENT_TIMESTAMP" },
    updated_at: { type: "timestamp", default: () => "CURRENT_TIMESTAMP" },
    spots: { type: "int", default: 1 },
    total_price: { type: "float", default: 0 },
  }
}); 