module.exports = class CreateArticleLikeComment1757050000000 {
  name = 'CreateArticleLikeComment1757050000000'

  async up(queryRunner) {
    await queryRunner.query(`CREATE TABLE "article_likes" (
      "id" SERIAL PRIMARY KEY,
      "user_id" integer NOT NULL,
      "article_id" integer NOT NULL,
      "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);
    await queryRunner.query(`CREATE TABLE "article_comments" (
      "id" SERIAL PRIMARY KEY,
      "user_id" integer NOT NULL,
      "article_id" integer NOT NULL,
      "content" text NOT NULL,
      "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP TABLE "article_likes"`);
    await queryRunner.query(`DROP TABLE "article_comments"`);
  }
}
