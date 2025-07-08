/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class AddPasswordResetFields1752300000000 {
    name = 'AddPasswordResetFields1752300000000'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "passwordResetToken" varchar(255)`);
        await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "passwordResetExpires" TIMESTAMP`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "passwordResetToken"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "passwordResetExpires"`);
    }
} 