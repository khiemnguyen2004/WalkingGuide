/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class CreateTourSteps1749991469290 {
    name = 'CreateTourSteps1749991469290'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "tour_steps" ("id" SERIAL NOT NULL, "tour_id" integer NOT NULL, "place_id" integer NOT NULL, "step_order" integer NOT NULL, "stay_duration" integer NOT NULL DEFAULT '60', CONSTRAINT "PK_6b14248c61a18f9821e7869503e" PRIMARY KEY ("id"))`);
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "tour_steps"`);
    }
}
