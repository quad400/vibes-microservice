import { MigrationInterface, QueryRunner } from "typeorm";

export class AlbumFavourite1725927783722 implements MigrationInterface {
    name = 'AlbumFavourite1725927783722'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "favourite_albums" ("is_deleted" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "track_id" character varying NOT NULL, CONSTRAINT "PK_fce33855f862176ed8cca04c34c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "album_likes" ("is_deleted" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" character varying NOT NULL, "album_id" uuid, CONSTRAINT "PK_cc85a60d847440a6b308143c735" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "albums" ("is_deleted" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "image_url" character varying NOT NULL DEFAULT 'https://res.cloudinary.com/dupox1iqn/image/upload/v1725275626/tv7o1nyoapzmlzc17ace.jpg', "description" character varying, "artist_id" character varying NOT NULL, "album_likes_count" integer NOT NULL DEFAULT '0', CONSTRAINT "UQ_2c85c318a6c245b0eecc2081952" UNIQUE ("title"), CONSTRAINT "PK_838ebae24d2e12082670ffc95d7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "favourite_albums" ADD CONSTRAINT "FK_0962b3f86d67b56f853fddf622c" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "album_likes" ADD CONSTRAINT "FK_a1ffdab2c973f0b2e6c4b41beac" FOREIGN KEY ("album_id") REFERENCES "albums"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "album_likes" DROP CONSTRAINT "FK_a1ffdab2c973f0b2e6c4b41beac"`);
        await queryRunner.query(`ALTER TABLE "favourite_albums" DROP CONSTRAINT "FK_0962b3f86d67b56f853fddf622c"`);
        await queryRunner.query(`DROP TABLE "albums"`);
        await queryRunner.query(`DROP TABLE "album_likes"`);
        await queryRunner.query(`DROP TABLE "favourite_albums"`);
    }

}
