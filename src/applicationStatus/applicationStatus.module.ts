import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ApplicationStatus } from "./applicationStatus.entity";
import { ApplicationStatusService } from "./applicationStatus.service";
import { ApplicationStatusController } from "./applicationStatus.controller";
import { StatusGateway } from "./status.gateway";
import { ApplicationStatusPayper } from "./applicationStatusPayper.entity";

@Module({
    imports: [TypeOrmModule.forFeature([ApplicationStatus]),TypeOrmModule.forFeature([ApplicationStatusPayper])],
    providers: [ApplicationStatusService, StatusGateway],
    controllers: [ApplicationStatusController],
})

export class ApplicationStatusModule { }