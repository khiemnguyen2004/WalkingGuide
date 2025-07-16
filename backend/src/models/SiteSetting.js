const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "SiteSetting",
  tableName: "site_settings",
  columns: {
    id: { primary: true, type: "int", generated: true },
    key: { type: "varchar", length: 100, unique: true },
    value: { type: "text" }, // JSON string for complex settings
    updated_at: { type: "timestamp", default: () => "CURRENT_TIMESTAMP" },
  },
}); 