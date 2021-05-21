import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ApplicationStatusPayper } from "./applicationStatusPayper.entity";
import { ApplicationStatusPayperService } from "./applicationStatusPayper.service";
import { ApplicationStatusPayperController } from "./applicationStatusPayper.controller";
import { StatusGateway } from "./status.gateway";

@Module({
  imports: [TypeOrmModule.forFeature([ApplicationStatusPayper])],
  providers: [ApplicationStatusPayperService, StatusGateway],
  controllers: [ApplicationStatusPayperController],
})

export class ApplicationStatusPayperModule { }