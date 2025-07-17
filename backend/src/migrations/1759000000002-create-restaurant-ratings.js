/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class CreateRestaurantRatings1759000000002 {
    name = 'CreateRestaurantRatings1759000000002'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "restaurant_ratings" (
            "id" SERIAL NOT NULL,
            "user_id" integer NOT NULL,
            "restaurant_id" integer NOT NULL,
            "rating" integer NOT NULL,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_restaurant_ratings_id" PRIMARY KEY ("id"),
            CONSTRAINT "UQ_restaurant_ratings_user_restaurant" UNIQUE ("user_id", "restaurant_id")
        )`);
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "restaurant_ratings"`);
    }
} 