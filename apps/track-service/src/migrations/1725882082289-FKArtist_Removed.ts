import { MigrationInterface, QueryRunner } from "typeorm";

export class FKArtistRemoved1725882082289 implements MigrationInterface {
    name = 'FKArtistRemoved1725882082289'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "albums" DROP CONSTRAINT "FK_b6465bf462c2ffef5f066bc6f21"`);
        await queryRunner.query(`ALTER TABLE "albums" DROP COLUMN "artist_id"`);
        await queryRunner.query(`ALTER TABLE "albums" ADD "artist_id" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "albums" DROP COLUMN "artist_id"`);
        await queryRunner.query(`ALTER TABLE "albums" ADD "artist_id" uuid`);
        await queryRunner.query(`ALTER TABLE "albums" ADD CONSTRAINT "FK_b6465bf462c2ffef5f066bc6f21" FOREIGN KEY ("artist_id") REFERENCES "artists"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
