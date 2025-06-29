/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class UpdatePlaces1751163195304 {
    name = 'UpdatePlaces1751163195304'

    async up(queryRunner) {
        // Check if columns already exist and add them as nullable first
        const hasCity = await queryRunner.hasColumn("places", "city");
        const hasAddress = await queryRunner.hasColumn("places", "address");
        const hasOpeningHours = await queryRunner.hasColumn("places", "opening_hours");
        const hasService = await queryRunner.hasColumn("places", "service");

        if (!hasCity) {
            await queryRunner.query(`ALTER TABLE "places" ADD "city" character varying(255)`);
        }
        if (!hasAddress) {
            await queryRunner.query(`ALTER TABLE "places" ADD "address" character varying(500)`);
        }
        if (!hasOpeningHours) {
            await queryRunner.query(`ALTER TABLE "places" ADD "opening_hours" text`);
        }
        if (!hasService) {
            await queryRunner.query(`ALTER TABLE "places" ADD "service" text`);
        }

        // Update existing records with default values
        await queryRunner.query(`UPDATE "places" SET "city" = 'Unknown City' WHERE "city" IS NULL`);
        await queryRunner.query(`UPDATE "places" SET "address" = 'No address provided' WHERE "address" IS NULL`);
        await queryRunner.query(`UPDATE "places" SET "opening_hours" = 'Hours not specified' WHERE "opening_hours" IS NULL`);
        await queryRunner.query(`UPDATE "places" SET "service" = 'Services not specified' WHERE "service" IS NULL`);

        // Make columns NOT NULL
        await queryRunner.query(`ALTER TABLE "places" ALTER COLUMN "city" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "places" ALTER COLUMN "address" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "places" ALTER COLUMN "opening_hours" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "places" ALTER COLUMN "service" SET NOT NULL`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "places" DROP COLUMN "service"`);
        await queryRunner.query(`ALTER TABLE "places" DROP COLUMN "opening_hours"`);
        await queryRunner.query(`ALTER TABLE "places" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "places" DROP COLUMN "city"`);
    }
}
