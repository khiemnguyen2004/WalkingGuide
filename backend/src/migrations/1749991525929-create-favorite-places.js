/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class CreateFavoritePlaces1749991525929 {
    name = 'CreateFavoritePlaces1749991525929'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "favorite_places" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "place_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_8e3a8de7c4207a54f64f9ac040f" UNIQUE ("user_id", "place_id"), CONSTRAINT "PK_0c0591bffc1e6e4529a8e0d1aa1" PRIMARY KEY ("id"))`);
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "favorite_places"`);
    }
}
