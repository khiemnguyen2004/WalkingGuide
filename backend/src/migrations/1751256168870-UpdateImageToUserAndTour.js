/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class UpdateImageToUserAndTour1751256168870 {
    name = 'UpdateImageToUserAndTour1751256168870'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "users" ADD "image_url" character varying(500)`);
        await queryRunner.query(`ALTER TABLE "tours" ADD "image_url" character varying(500)`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "tours" DROP COLUMN "image_url"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "image_url"`);
    }
}
