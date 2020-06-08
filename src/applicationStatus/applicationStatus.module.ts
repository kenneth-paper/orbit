import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ApplicationStatus } from "./applicationStatus.entity";
import { ApplicationStatusService } from "./applicationStatus.service";
import { ApplicationStatusController } from "./applicationStatus.controller";
import { StatusGateway } from "./status.gateway";

@Module({
    imports: [TypeOrmModule.forFeature([ApplicationStatus])],
    providers: [ApplicationStatusService, StatusGateway],
    controllers: [ApplicationStatusController],
})

export class ApplicationStatusModule { }