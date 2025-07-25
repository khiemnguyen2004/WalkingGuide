const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Notification",
  tableName: "notifications",
  columns: {
    notification_id: { primary: true, type: "int", generated: true },
    user_id: { type: "int" },
    content: { type: "text", nullable: false },
    type: { type: "varchar", length: 50, nullable: true }, // tour_reminder, tour_completion, tour_created, etc.
    tour_id: { type: "int", nullable: true }, // Reference to tour for tour-related notifications
    article_id: { type: "int", nullable: true }, // Reference to article for article-related notifications
    place_id: { type: "int", nullable: true }, // Reference to place for place-related notifications
    comment_id: { type: "int", nullable: true }, // Reference to comment for comment notifications
    is_read: { type: "boolean", default: false },
    created_at: { type: "timestamp", default: () => "CURRENT_TIMESTAMP" },
  }
});