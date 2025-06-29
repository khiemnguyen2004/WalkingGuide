/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class UpdateNotifications1751164000000 {
    name = 'UpdateNotifications1751164000000'

    async up(queryRunner) {
        // Add type column
        await queryRunner.query(`ALTER TABLE "notifications" ADD "type" character varying(50)`);
        
        // Add tour_id column
        await queryRunner.query(`ALTER TABLE "notifications" ADD "tour_id" integer`);
    }

    async down(queryRunner) {
        // Remove tour_id column
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "tour_id"`);
        
        // Remove type column
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "type"`);
    }
}; 