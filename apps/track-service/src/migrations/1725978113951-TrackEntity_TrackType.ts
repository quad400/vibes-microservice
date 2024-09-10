import { MigrationInterface, QueryRunner } from "typeorm";

export class TrackEntityTrackType1725978113951 implements MigrationInterface {
    name = 'TrackEntityTrackType1725978113951'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tracks" ADD "track_type" character varying NOT NULL DEFAULT 'SINGLE'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tracks" DROP COLUMN "track_type"`);
    }

}
