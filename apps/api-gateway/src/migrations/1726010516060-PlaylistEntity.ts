import { MigrationInterface, QueryRunner } from "typeorm";

export class PlaylistEntity1726010516060 implements MigrationInterface {
    name = 'PlaylistEntity1726010516060'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "playlist_tracks" ("is_deleted" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "playlist_id" character varying NOT NULL, "track_id" character varying NOT NULL, "playlistId" uuid, CONSTRAINT "PK_0f93b1a2df4de2e5b48c1459617" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "playlists" ("is_deleted" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying, "image_url" character varying, "is_published" boolean NOT NULL DEFAULT false, "user_id" character varying NOT NULL, CONSTRAINT "PK_a4597f4189a75d20507f3f7ef0d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "playlist_tracks" ADD CONSTRAINT "FK_502ada93a48b5f9f7d7d2b3f0d7" FOREIGN KEY ("playlistId") REFERENCES "playlists"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "playlist_tracks" DROP CONSTRAINT "FK_502ada93a48b5f9f7d7d2b3f0d7"`);
        await queryRunner.query(`DROP TABLE "playlists"`);
        await queryRunner.query(`DROP TABLE "playlist_tracks"`);
    }

}
