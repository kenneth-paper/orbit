import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class mobileAndroidStatus1694498991296 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        let columns = [
            new TableColumn({
                name: 'version_mobile_android',
                type: 'varchar',
                length: '50',
                isNullable: true,
            }),
        ];

        let table = await queryRunner.getTable('application_status');

        if (table) {
            let column = table.findColumnByName("version_mobile_android");
            if (!column) {
                await queryRunner.addColumns('application_status', columns);
            }
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        let columns = [
            new TableColumn({
                name: 'version_mobile_android',
                type: 'varchar',
                length: '50',
                isNullable: true,
            }),
        ];

        let table = await queryRunner.getTable('application_status');

        if (table) {
            let column = table.findColumnByName("version_mobile_android");
            if (!column) {
                await queryRunner.dropColumns('application_status', columns);
            }
        }
    }

}
