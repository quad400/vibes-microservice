import { MigrationInterface, QueryRunner } from "typeorm";

export class PlaylistUserEntity1726193973441 implements MigrationInterface {
    name = 'PlaylistUserEntity1726193973441'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "playlists" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "playlists" ADD "user_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "playlists" ADD CONSTRAINT "FK_a3ea169575c25e5c55494d7f382" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "playlists" DROP CONSTRAINT "FK_a3ea169575c25e5c55494d7f382"`);
        await queryRunner.query(`ALTER TABLE "playlists" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "playlists" ADD "user_id" character varying NOT NULL`);
    }

}
