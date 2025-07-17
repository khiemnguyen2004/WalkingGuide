/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class CreateMenuItems1758000000002 {
    name = 'CreateMenuItems1758000000002'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "menu_items" (
            "id" SERIAL NOT NULL,
            "menu_id" integer NOT NULL,
            "name" varchar(255) NOT NULL,
            "price" float NOT NULL DEFAULT 0,
            "description" text,
            "image_url" varchar(500),
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_menu_items_id" PRIMARY KEY ("id")
        )`);
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "menu_items"`);
    }
} 