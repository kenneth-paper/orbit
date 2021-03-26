import {MigrationInterface, QueryRunner} from "typeorm";

export class createTableApplicationStatusSAP1615566312220 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `application_status_sap` (`uuid` varchar(255) NOT NULL, `version_front_end` varchar(512) NOT NULL, `version_mobile_app` varchar(50) NOT NULL,`status` int NOT NULL, PRIMARY KEY (`uuid`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `application_status_sap`");
    }

}
