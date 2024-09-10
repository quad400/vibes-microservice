import { MigrationInterface, QueryRunner } from "typeorm";

export class AlbumFavouriteAlbumid1725930176432 implements MigrationInterface {
    name = 'AlbumFavouriteAlbumid1725930176432'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "favourite_albums" RENAME COLUMN "track_id" TO "album_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "favourite_albums" RENAME COLUMN "album_id" TO "track_id"`);
    }

}
