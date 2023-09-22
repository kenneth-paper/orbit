import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class mobileIosStatus1694499009207 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        let columns = [
            new TableColumn({
                name: 'version_mobile_ios',
                type: 'varchar',
                length: '50',
                isNullable: true,
            }),
        ];

        let table = await queryRunner.getTable('application_status');

        if (table) {
            let column = table.findColumnByName("version_mobile_ios");
            if (!column) {
                await queryRunner.addColumns('application_status', columns);
            }
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        let columns = [
            new TableColumn({
                name: 'version_mobile_ios',
                type: 'varchar',
                length: '50',
                isNullable: true,
            }),
        ];

        let table = await queryRunner.getTable('application_status');

        if (table) {
            let column = table.findColumnByName("version_mobile_ios");
            if (!column) {
                await queryRunner.dropColumns('application_status', columns);
            }
        }
    }

}
