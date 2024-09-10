import { MigrationInterface, QueryRunner } from "typeorm";

export class TrackEntityTrackLikesCount1725984787728 implements MigrationInterface {
    name = 'TrackEntityTrackLikesCount1725984787728'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tracks" ADD "track_likes_count" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tracks" DROP COLUMN "track_likes_count"`);
    }

}
