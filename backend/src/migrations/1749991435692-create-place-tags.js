/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class CreatePlaceTags1749991435692 {
    name = 'CreatePlaceTags1749991435692'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "place_tags" ("id" SERIAL NOT NULL, "place_id" integer NOT NULL, "tag_id" integer NOT NULL, CONSTRAINT "UQ_de64b8c00add4ac2fcc0dbfcc59" UNIQUE ("place_id", "tag_id"), CONSTRAINT "PK_baf83127acae6256d3cffa3cfb1" PRIMARY KEY ("id"))`);
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "place_tags"`);
    }
}
