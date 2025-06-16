const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Notification",
  tableName: "notifications",
  columns: {
    notification_id: { primary: true, type: "int", generated: true },
    user_id: { type: "int" },
    content: { type: "text", nullable: false },
    is_read: { type: "boolean", default: false },
    created_at: { type: "timestamp", default: () => "CURRENT_TIMESTAMP" },
  }
});