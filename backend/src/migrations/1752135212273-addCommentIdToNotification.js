/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class AddCommentIdToNotification1752135212273 {
    name = 'AddCommentIdToNotification1752135212273'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "notifications" ADD "comment_id" integer`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "comment_id"`);
    }
}
