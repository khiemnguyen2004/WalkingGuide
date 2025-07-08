const { TableColumn } = require("typeorm");

module.exports = class AddEmailVerificationToUsers1752050000000 {
  async up(queryRunner) {
    await queryRunner.addColumn("users", new TableColumn({
      name: "isEmailVerified",
      type: "boolean",
      default: false,
      isNullable: false,
    }));
    await queryRunner.addColumn("users", new TableColumn({
      name: "emailVerificationToken",
      type: "varchar",
      length: "255",
      isNullable: true,
    }));
  }

  async down(queryRunner) {
    await queryRunner.dropColumn("users", "isEmailVerified");
    await queryRunner.dropColumn("users", "emailVerificationToken");
  }
};
