import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity('application_status_sap')
export class ApplicationStatusSAP {
    @PrimaryColumn()
    // @Column({ length: 255 })
    uuid: string;
    @Column()
    status: number;
    @Column({ length: 512 })
    version_front_end: string;
    @Column({ length: 50 })
    version_mobile_app: string;
}