/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class AddArticleIdAndPlaceIdToNotifications1752134765958 {
    name = 'AddArticleIdAndPlaceIdToNotifications1752134765958'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "notifications" ADD "article_id" integer`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD "place_id" integer`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "place_id"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "article_id"`);
    }
}
