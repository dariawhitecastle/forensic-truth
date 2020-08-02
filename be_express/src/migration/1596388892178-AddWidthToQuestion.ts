import {MigrationInterface, QueryRunner} from "typeorm";

export class OrderedSections1596388892178 implements MigrationInterface {
    name = 'OrderedSections1596388892178'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "question" ADD "width" integer`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "width"`, undefined);
    }

}
