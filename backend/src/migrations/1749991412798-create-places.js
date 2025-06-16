/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class CreatePlaces1749991412798 {
    name = 'CreatePlaces1749991412798'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "places" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "description" text NOT NULL, "latitude" double precision NOT NULL, "longitude" double precision NOT NULL, "image_url" character varying(255) NOT NULL, "rating" double precision NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1afab86e226b4c3bc9a74465c12" PRIMARY KEY ("id"))`);
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "places"`);
    }
}
