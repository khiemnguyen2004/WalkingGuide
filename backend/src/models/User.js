// src/models/User.js
const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    email: {
      type: "varchar",
      unique: true,
      nullable: false,
    },
    password_hash: {
      type: "varchar",
      nullable: false,
    },
    full_name: {
      type: "varchar",
      nullable: false,
    },
    image_url: {
      type: "varchar",
      length: 500,
      nullable: true,
    },
    role: {
      type: "varchar",
      length: 10,
      nullable: false,
    },
    created_at: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },
    updated_at: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },
    isEmailVerified: {
      type: "boolean",
      default: false,
    },
    emailVerificationToken: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    passwordResetToken: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    passwordResetExpires: {
      type: "timestamp",
      nullable: true,
    },
  },
});
