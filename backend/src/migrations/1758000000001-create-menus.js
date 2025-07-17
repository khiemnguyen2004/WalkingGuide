/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class CreateMenus1758000000001 {
    name = 'CreateMenus1758000000001'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "menus" (
            "id" SERIAL NOT NULL,
            "restaurant_id" integer NOT NULL,
            "name" varchar(255) NOT NULL,
            "description" text,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_menus_id" PRIMARY KEY ("id")
        )`);
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "menus"`);
    }
} 