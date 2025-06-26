const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "TourStep",
  tableName: "tour_steps",
  columns: {
    id: { primary: true, type: "int", generated: true },
    tour_id: { type: "int" },
    place_id: { type: "int" },
    step_order: { type: "int", nullable: false },
    stay_duration: { type: "int", default: 60 },
    start_time: { type: "time", nullable: true },
    end_time: { type: "time", nullable: true },
  }
});
