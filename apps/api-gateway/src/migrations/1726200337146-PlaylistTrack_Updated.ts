import { MigrationInterface, QueryRunner } from "typeorm";

export class PlaylistTrackUpdated1726200337146 implements MigrationInterface {
    name = 'PlaylistTrackUpdated1726200337146'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "playlist_tracks" DROP CONSTRAINT "FK_502ada93a48b5f9f7d7d2b3f0d7"`);
        await queryRunner.query(`ALTER TABLE "playlist_tracks" DROP COLUMN "playlistId"`);
        await queryRunner.query(`ALTER TABLE "playlist_tracks" DROP COLUMN "playlist_id"`);
        await queryRunner.query(`ALTER TABLE "playlist_tracks" ADD "playlist_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "playlist_tracks" ADD CONSTRAINT "FK_7ef165e08a3b87eae8cf4275cda" FOREIGN KEY ("playlist_id") REFERENCES "playlists"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "playlist_tracks" DROP CONSTRAINT "FK_7ef165e08a3b87eae8cf4275cda"`);
        await queryRunner.query(`ALTER TABLE "playlist_tracks" DROP COLUMN "playlist_id"`);
        await queryRunner.query(`ALTER TABLE "playlist_tracks" ADD "playlist_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "playlist_tracks" ADD "playlistId" uuid`);
        await queryRunner.query(`ALTER TABLE "playlist_tracks" ADD CONSTRAINT "FK_502ada93a48b5f9f7d7d2b3f0d7" FOREIGN KEY ("playlistId") REFERENCES "playlists"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
