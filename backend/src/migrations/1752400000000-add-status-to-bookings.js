module.exports = class AddStatusToBookings1752400000000 {
    name = 'AddStatusToBookings1752400000000'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "bookings" ADD COLUMN "status" varchar(20) NOT NULL DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD COLUMN "admin_notes" text`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "admin_notes"`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "status"`);
    }
}; 