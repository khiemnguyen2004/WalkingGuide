module.exports = class AddSpotsAndTotalPriceToBookings1752310000000 {
    name = 'AddSpotsAndTotalPriceToBookings1752310000000'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "bookings" ADD COLUMN "spots" integer NOT NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD COLUMN "total_price" float NOT NULL DEFAULT 0`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "spots"`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "total_price"`);
    }
} 