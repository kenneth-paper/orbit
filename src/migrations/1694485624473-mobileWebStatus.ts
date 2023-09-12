import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class mobileWebStatus1694485624473 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        let columns = [
            new TableColumn({
                name: 'version_mobile_web',
                type: 'varchar',
                length: '50',
                isNullable: true,
            }),
        ];

        let table = await queryRunner.getTable('application_status');

        if (table) {
            let column = table.findColumnByName("version_mobile_web");
            if (!column) {
                await queryRunner.addColumns('application_status', columns);
            }
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        let columns = [
            new TableColumn({
                name: 'version_mobile_web',
                type: 'varchar',
                length: '50',
                isNullable: true,
            }),
        ];

        let table = await queryRunner.getTable('application_status');

        if (table) {
            let column = table.findColumnByName("version_mobile_web");
            if (!column) {
                await queryRunner.dropColumns('application_status', columns);
            }
        }
    }

}
