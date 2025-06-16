/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class CreateComments1749991505050 {
    name = 'CreateComments1749991505050'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "comments" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "place_id" integer NOT NULL, "content" text NOT NULL, "rating" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"))`);
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "comments"`);
    }
}
