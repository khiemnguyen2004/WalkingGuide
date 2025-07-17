module.exports = class AddStatusToTours1652655000000 {
  async up(queryRunner) {
    await queryRunner.query(`ALTER TABLE tours ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'pending'`);
  }
  async down(queryRunner) {
    await queryRunner.query(`ALTER TABLE tours DROP COLUMN status`);
  }
} 