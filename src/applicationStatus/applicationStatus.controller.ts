import { Controller, Get, Put, Body, Res } from "@nestjs/common";
import { ApplicationStatusService } from "./applicationStatus.service";
import { ApplicationStatus } from "./applicationStatus.entity";
import { Response } from 'express';

@Controller('application-status')
export class ApplicationStatusController {

    constructor(private service: ApplicationStatusService) { }

    @Get()
    getApplicationStatus() {
        return this.service.getApplicationStatus();
    }

    @Put()
    async updateApplicationStatus(@Res() res: Response,@Body() applicationStatus: ApplicationStatus) : Promise<any>{
        let updatedStatus = await this.service.updateApplicationStatus(applicationStatus);
        res.status(200).json(applicationStatus);
    }
}