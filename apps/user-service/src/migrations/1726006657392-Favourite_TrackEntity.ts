import { MigrationInterface, QueryRunner } from "typeorm";

export class FavouriteTrackEntity1726006657392 implements MigrationInterface {
    name = 'FavouriteTrackEntity1726006657392'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "favourite_tracks" ("is_deleted" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "track_id" character varying NOT NULL, CONSTRAINT "PK_c9bef793917883d29f58a300563" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "favourite_tracks" ADD CONSTRAINT "FK_1f1a11dbd543bdc58c2f2e5e82a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "favourite_tracks" DROP CONSTRAINT "FK_1f1a11dbd543bdc58c2f2e5e82a"`);
        await queryRunner.query(`DROP TABLE "favourite_tracks"`);
    }

}
