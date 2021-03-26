import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ApplicationStatusSAP } from "./applicationStatusSAP.entity";
import { ApplicationStatusSAPService } from "./applicationStatusSAP.service";
import { ApplicationStatusSAPController } from "./applicationStatusSAP.controller";
import { StatusGateway } from "./status.gateway";

@Module({
    imports: [TypeOrmModule.forFeature([ApplicationStatusSAP])],
    providers: [ApplicationStatusSAPService, StatusGateway],
    controllers: [ApplicationStatusSAPController],
})

export class ApplicationStatusSAPModule { }