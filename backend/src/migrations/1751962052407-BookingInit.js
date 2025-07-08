/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class BookingInit1751962052407 {
    name = 'BookingInit1751962052407'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "bookings" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "tour_id" integer NOT NULL, "start_date" date NOT NULL, "end_date" date NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_bee6805982cc1e248e94ce94957" PRIMARY KEY ("id"))`);
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "bookings"`);
    }
}
