/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class AddStartEndTimeToTourStep1750908720595 {
    name = 'AddStartEndTimeToTourStep1750908720595'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "tours" ADD "start_time" TIME`);
        await queryRunner.query(`ALTER TABLE "tours" ADD "end_time" TIME`);
        await queryRunner.query(`ALTER TABLE "tour_steps" ADD "start_time" TIME`);
        await queryRunner.query(`ALTER TABLE "tour_steps" ADD "end_time" TIME`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "tour_steps" DROP COLUMN "end_time"`);
        await queryRunner.query(`ALTER TABLE "tour_steps" DROP COLUMN "start_time"`);
        await queryRunner.query(`ALTER TABLE "tours" DROP COLUMN "end_time"`);
        await queryRunner.query(`ALTER TABLE "tours" DROP COLUMN "start_time"`);
    }
}
