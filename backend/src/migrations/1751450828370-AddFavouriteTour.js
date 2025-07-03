/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class AddFavouriteTour1751450828370 {
    name = 'AddFavouriteTour1751450828370'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "favorite_tours" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "tour_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_c5b2563ad71e453f4f74489b02b" UNIQUE ("user_id", "tour_id"), CONSTRAINT "PK_7b2af9d69994a82080859f42b90" PRIMARY KEY ("id"))`);
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "favorite_tours"`);
    }
}
