/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class CreateHotelBookings1752500000000 {
    name = 'CreateHotelBookings1752500000000'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "hotel_bookings" (
          "id" SERIAL NOT NULL,
          "user_id" integer NOT NULL,
          "hotel_id" integer NOT NULL,
          "tour_id" integer,
          "check_in" date NOT NULL,
          "check_out" date NOT NULL,
          "created_at" TIMESTAMP NOT NULL DEFAULT now(),
          CONSTRAINT "PK_hotel_bookings_id" PRIMARY KEY ("id")
        )`);
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "hotel_bookings"`);
    }
} 