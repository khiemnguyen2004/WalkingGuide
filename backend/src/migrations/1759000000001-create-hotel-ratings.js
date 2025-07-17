/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class CreateHotelRatings1759000000001 {
    name = 'CreateHotelRatings1759000000001'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "hotel_ratings" (
            "id" SERIAL NOT NULL,
            "user_id" integer NOT NULL,
            "hotel_id" integer NOT NULL,
            "rating" integer NOT NULL,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_hotel_ratings_id" PRIMARY KEY ("id"),
            CONSTRAINT "UQ_hotel_ratings_user_hotel" UNIQUE ("user_id", "hotel_id")
        )`);
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "hotel_ratings"`);
    }
} 