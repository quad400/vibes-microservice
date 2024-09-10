import { MigrationInterface, QueryRunner } from "typeorm";

export class AlbumLikeCount1725926330264 implements MigrationInterface {
    name = 'AlbumLikeCount1725926330264'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "album_likes" DROP CONSTRAINT "FK_0b26b50c15a8dd171c2dde2571f"`);
        await queryRunner.query(`ALTER TABLE "album_likes" ADD "is_deleted" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "album_likes" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "album_likes" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "albums" ADD "album_likes_count" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "album_likes" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "album_likes" ADD "user_id" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "album_likes" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "album_likes" ADD "user_id" uuid`);
        await queryRunner.query(`ALTER TABLE "albums" DROP COLUMN "album_likes_count"`);
        await queryRunner.query(`ALTER TABLE "album_likes" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "album_likes" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "album_likes" DROP COLUMN "is_deleted"`);
        await queryRunner.query(`ALTER TABLE "album_likes" ADD CONSTRAINT "FK_0b26b50c15a8dd171c2dde2571f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
