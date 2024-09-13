import { MigrationInterface, QueryRunner } from "typeorm";

export class PlaylistTrackPlaylistCascade1726221874878 implements MigrationInterface {
    name = 'PlaylistTrackPlaylistCascade1726221874878'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "playlist_tracks" DROP CONSTRAINT "FK_7ef165e08a3b87eae8cf4275cda"`);
        await queryRunner.query(`ALTER TABLE "playlist_tracks" ADD CONSTRAINT "FK_7ef165e08a3b87eae8cf4275cda" FOREIGN KEY ("playlist_id") REFERENCES "playlists"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "playlist_tracks" DROP CONSTRAINT "FK_7ef165e08a3b87eae8cf4275cda"`);
        await queryRunner.query(`ALTER TABLE "playlist_tracks" ADD CONSTRAINT "FK_7ef165e08a3b87eae8cf4275cda" FOREIGN KEY ("playlist_id") REFERENCES "playlists"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
