/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class CreateTours1749991457768 {
    name = 'CreateTours1749991457768'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "tours" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "name" character varying(255) NOT NULL, "description" text NOT NULL, "total_cost" double precision NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2202ba445792c1ad0edf2de8de2" PRIMARY KEY ("id"))`);
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "tours"`);
    }
}
