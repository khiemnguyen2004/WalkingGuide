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
        await queryRunner.query(`
      CREATE TABLE "hotel_bookings" (
        "id" SERIAL PRIMARY KEY,
        "user_id" integer NOT NULL,
        "hotel_id" integer NOT NULL,
        "tour_id" integer,
        "check_in" date NOT NULL,
        "check_out" date NOT NULL,
        "room_type" varchar(100),
        "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "hotel_bookings"`);
    }
} 