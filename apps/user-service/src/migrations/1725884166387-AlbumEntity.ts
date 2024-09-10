import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlbumEntity1725884166387 implements MigrationInterface {
  name = 'AlbumEntity1725884166387';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "artists" ("is_deleted" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "stage_name" character varying NOT NULL, "bio" character varying, "genre" "public"."artists_genre_enum" NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "UQ_2e97c29b2815ff130344120f870" UNIQUE ("stage_name"), CONSTRAINT "REL_b6ae1e521cfeccade55e889f3d" UNIQUE ("user_id"), CONSTRAINT "PK_09b823d4607d2675dc4ffa82261" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "artists" ADD CONSTRAINT "FK_b6ae1e521cfeccade55e889f3d7" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "artists" DROP CONSTRAINT "FK_b6ae1e521cfeccade55e889f3d7"`,
    );
    await queryRunner.query(`DROP TABLE "artists"`);
  }
}
