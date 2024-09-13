import { MigrationInterface, QueryRunner } from "typeorm";

export class PlaylistTrackUser1726201213420 implements MigrationInterface {
    name = 'PlaylistTrackUser1726201213420'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "playlist_tracks" ADD "user_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "playlist_tracks" ADD CONSTRAINT "FK_002b3c0909ab40622ae9a956014" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "playlist_tracks" DROP CONSTRAINT "FK_002b3c0909ab40622ae9a956014"`);
        await queryRunner.query(`ALTER TABLE "playlist_tracks" DROP COLUMN "user_id"`);
    }

}
