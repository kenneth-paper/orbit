import { Controller, Get, Put, Body } from "@nestjs/common";
import { ApplicationStatusPayperService } from "./applicationStatusPayper.service";
import { ApplicationStatusPayper } from "./applicationStatusPayper.entity";

@Controller('application-status/payper')
export class ApplicationStatusPayperController {

  constructor(private service: ApplicationStatusPayperService) { }

  @Get()
  getPayperApplicationStatus() {
    return this.service.getApplicationStatus();
  }

  @Put()
  updatePayperApplicationStatus(@Body() applicationStatus: ApplicationStatusPayper){
    return this.service.updateApplicationStatus(applicationStatus);
  }
}