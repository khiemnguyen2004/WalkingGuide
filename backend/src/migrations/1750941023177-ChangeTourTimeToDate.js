/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class ChangeTourTimeToDate1750941023177 {
    name = 'ChangeTourTimeToDate1750941023177'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "tours" DROP COLUMN "start_time"`);
        await queryRunner.query(`ALTER TABLE "tours" ADD "start_time" date`);
        await queryRunner.query(`ALTER TABLE "tours" DROP COLUMN "end_time"`);
        await queryRunner.query(`ALTER TABLE "tours" ADD "end_time" date`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "tours" DROP COLUMN "end_time"`);
        await queryRunner.query(`ALTER TABLE "tours" ADD "end_time" TIME`);
        await queryRunner.query(`ALTER TABLE "tours" DROP COLUMN "start_time"`);
        await queryRunner.query(`ALTER TABLE "tours" ADD "start_time" TIME`);
    }
}
