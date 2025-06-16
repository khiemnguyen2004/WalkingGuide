/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class CreateArticles1749991486465 {
    name = 'CreateArticles1749991486465'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "articles" ("article_id" SERIAL NOT NULL, "admin_id" integer NOT NULL, "title" character varying(255) NOT NULL, "content" text NOT NULL, "image_url" character varying(255) NOT NULL, "published_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b9a16e8d0dc20426e1611e560bc" PRIMARY KEY ("article_id"))`);
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "articles"`);
    }
}
