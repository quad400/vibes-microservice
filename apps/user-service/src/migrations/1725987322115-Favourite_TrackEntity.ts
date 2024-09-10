import { MigrationInterface, QueryRunner } from "typeorm";

export class FavouriteTrackEntity1725987322115 implements MigrationInterface {
    name = 'FavouriteTrackEntity1725987322115'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "favourite_albums" RENAME COLUMN "album_id" TO "track_id"`);
        await queryRunner.query(`CREATE TABLE "track_likes" ("is_deleted" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" character varying NOT NULL, "track_id" uuid NOT NULL, CONSTRAINT "PK_81c79eef7d466e389e350c3bfbb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "play" ("is_deleted" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" character varying NOT NULL, "track_id" uuid NOT NULL, CONSTRAINT "PK_78bc0ac5050cc1068217341a73e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tracks" ("is_deleted" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "image_url" character varying NOT NULL, "audio_url" character varying NOT NULL, "album_id" uuid, "artist_id" character varying NOT NULL, "track_type" character varying NOT NULL DEFAULT 'SINGLE', "track_plays_count" integer NOT NULL DEFAULT '0', "track_likes_count" integer NOT NULL DEFAULT '0', CONSTRAINT "UQ_30f73369783dcb7e7bc57276503" UNIQUE ("title"), CONSTRAINT "PK_242a37ffc7870380f0e611986e8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "favourite_albums" DROP COLUMN "track_id"`);
        await queryRunner.query(`ALTER TABLE "favourite_albums" ADD "album_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "favourite_albums" ADD "track_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "track_likes" ADD CONSTRAINT "FK_dd02f6452b31db92c506c8c700c" FOREIGN KEY ("track_id") REFERENCES "tracks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "play" ADD CONSTRAINT "FK_6f4515331f848ce80966ab37010" FOREIGN KEY ("track_id") REFERENCES "tracks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tracks" ADD CONSTRAINT "FK_fceb1d9483fda6a312af244a80e" FOREIGN KEY ("album_id") REFERENCES "albums"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tracks" DROP CONSTRAINT "FK_fceb1d9483fda6a312af244a80e"`);
        await queryRunner.query(`ALTER TABLE "play" DROP CONSTRAINT "FK_6f4515331f848ce80966ab37010"`);
        await queryRunner.query(`ALTER TABLE "track_likes" DROP CONSTRAINT "FK_dd02f6452b31db92c506c8c700c"`);
        await queryRunner.query(`ALTER TABLE "favourite_albums" DROP COLUMN "track_id"`);
        await queryRunner.query(`ALTER TABLE "favourite_albums" DROP COLUMN "album_id"`);
        await queryRunner.query(`ALTER TABLE "favourite_albums" ADD "track_id" character varying NOT NULL`);
        await queryRunner.query(`DROP TABLE "tracks"`);
        await queryRunner.query(`DROP TABLE "play"`);
        await queryRunner.query(`DROP TABLE "track_likes"`);
        await queryRunner.query(`ALTER TABLE "favourite_albums" RENAME COLUMN "track_id" TO "album_id"`);
    }

}
