/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class CreateSiteSettings1752600000000 {
    name = 'CreateSiteSettings1752600000000'

    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "site_settings" (
                "id" SERIAL PRIMARY KEY,
                "key" VARCHAR(100) UNIQUE NOT NULL,
                "value" TEXT,
                "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "site_settings"`);
    }
}; 