/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class CreateRestaurantBookings1758000000000 {
    name = 'CreateRestaurantBookings1758000000000'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "restaurant_bookings" (
            "id" SERIAL NOT NULL,
            "user_id" integer NOT NULL,
            "restaurant_id" integer NOT NULL,
            "booking_time" TIMESTAMP NOT NULL,
            "number_of_people" integer NOT NULL DEFAULT 1,
            "special_requests" text,
            "status" varchar(20) NOT NULL DEFAULT 'pending',
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_restaurant_bookings_id" PRIMARY KEY ("id")
        )`);
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "restaurant_bookings"`);
    }
} 