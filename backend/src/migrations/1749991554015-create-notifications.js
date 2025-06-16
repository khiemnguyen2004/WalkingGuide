/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class CreateNotifications1749991554015 {
    name = 'CreateNotifications1749991554015'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "notifications" ("notification_id" SERIAL NOT NULL, "user_id" integer NOT NULL, "content" text NOT NULL, "is_read" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_eaedfe19f0f765d26afafa85956" PRIMARY KEY ("notification_id"))`);
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "notifications"`);
    }
}
