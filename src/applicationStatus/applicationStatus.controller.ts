import { Controller, Get, Put, Body } from "@nestjs/common";
import { ApplicationStatusService } from "./applicationStatus.service";
import { ApplicationStatus } from "./applicationStatus.entity";

@Controller('application-status')
export class ApplicationStatusController {

    constructor(private service: ApplicationStatusService) { }

    @Get()
    getApplicationStatus() {
        return this.service.getApplicationStatus();
    }

    @Put()
    updateApplicationStatus(@Body() applicationStatus: ApplicationStatus){
        return this.service.updateApplicationStatus(applicationStatus);
    }
}