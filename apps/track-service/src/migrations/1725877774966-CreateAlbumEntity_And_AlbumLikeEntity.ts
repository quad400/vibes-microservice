import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAlbumEntityAndAlbumLikeEntity1725877774966 implements MigrationInterface {
    name = 'CreateAlbumEntityAndAlbumLikeEntity1725877774966'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "follows" ("is_deleted" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "follower_id" uuid NOT NULL, "following_id" uuid NOT NULL, CONSTRAINT "PK_8988f607744e16ff79da3b8a627" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."artists_genre_enum" AS ENUM('pop', 'rock', 'afrosounds', 'hip-hop', 'rnb', 'jazz', 'blues', 'other')`);
        await queryRunner.query(`CREATE TABLE "artists" ("is_deleted" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "stage_name" character varying NOT NULL, "bio" character varying, "genre" "public"."artists_genre_enum" NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "UQ_2e97c29b2815ff130344120f870" UNIQUE ("stage_name"), CONSTRAINT "REL_b6ae1e521cfeccade55e889f3d" UNIQUE ("user_id"), CONSTRAINT "PK_09b823d4607d2675dc4ffa82261" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("is_deleted" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "username" character varying, "email" character varying NOT NULL, "role" character varying NOT NULL DEFAULT 'listener', "password" character varying NOT NULL, "avatar" character varying NOT NULL DEFAULT 'https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg', "otp_expired_date" TIMESTAMP, "otp_code" character varying, "socials" jsonb, "is_verified" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "album_likes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "album_id" uuid, "user_id" uuid, CONSTRAINT "PK_cc85a60d847440a6b308143c735" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "albums" ("is_deleted" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "image_url" character varying NOT NULL DEFAULT 'https://res.cloudinary.com/dupox1iqn/image/upload/v1725275626/tv7o1nyoapzmlzc17ace.jpg', "description" character varying, "artist_id" uuid, CONSTRAINT "UQ_2c85c318a6c245b0eecc2081952" UNIQUE ("title"), CONSTRAINT "PK_838ebae24d2e12082670ffc95d7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "follows" ADD CONSTRAINT "FK_54b5dc2739f2dea57900933db66" FOREIGN KEY ("follower_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "follows" ADD CONSTRAINT "FK_c518e3988b9c057920afaf2d8c0" FOREIGN KEY ("following_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "artists" ADD CONSTRAINT "FK_b6ae1e521cfeccade55e889f3d7" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "album_likes" ADD CONSTRAINT "FK_a1ffdab2c973f0b2e6c4b41beac" FOREIGN KEY ("album_id") REFERENCES "albums"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "album_likes" ADD CONSTRAINT "FK_0b26b50c15a8dd171c2dde2571f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "albums" ADD CONSTRAINT "FK_b6465bf462c2ffef5f066bc6f21" FOREIGN KEY ("artist_id") REFERENCES "artists"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "albums" DROP CONSTRAINT "FK_b6465bf462c2ffef5f066bc6f21"`);
        await queryRunner.query(`ALTER TABLE "album_likes" DROP CONSTRAINT "FK_0b26b50c15a8dd171c2dde2571f"`);
        await queryRunner.query(`ALTER TABLE "album_likes" DROP CONSTRAINT "FK_a1ffdab2c973f0b2e6c4b41beac"`);
        await queryRunner.query(`ALTER TABLE "artists" DROP CONSTRAINT "FK_b6ae1e521cfeccade55e889f3d7"`);
        await queryRunner.query(`ALTER TABLE "follows" DROP CONSTRAINT "FK_c518e3988b9c057920afaf2d8c0"`);
        await queryRunner.query(`ALTER TABLE "follows" DROP CONSTRAINT "FK_54b5dc2739f2dea57900933db66"`);
        await queryRunner.query(`DROP TABLE "albums"`);
        await queryRunner.query(`DROP TABLE "album_likes"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "artists"`);
        await queryRunner.query(`DROP TYPE "public"."artists_genre_enum"`);
        await queryRunner.query(`DROP TABLE "follows"`);
    }

}
