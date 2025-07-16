/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class AddStartFromToTours1752565458299 {
    name = 'AddStartFromToTours1752565458299'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "tours" ADD "start_from" character varying(255)`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "tours" DROP COLUMN "start_from"`);
    }
}
