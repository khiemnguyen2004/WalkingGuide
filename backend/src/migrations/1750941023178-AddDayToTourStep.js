"use strict";

/** @type {import('typeorm').Migration} */
module.exports = class AddDayToTourStep1750941023178 {
    name = 'AddDayToTourStep1750941023178'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "tour_steps" ADD "day" integer NOT NULL DEFAULT 1`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "tour_steps" DROP COLUMN "day"`);
    }
} 