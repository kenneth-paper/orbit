import { Controller, Get, Put, Body, Res } from "@nestjs/common";
import { ApplicationStatusSAPService } from "./applicationStatusSAP.service";
import { ApplicationStatusSAP } from "./applicationStatusSAP.entity";
import { Response } from 'express';

@Controller('application-status/sap')
export class ApplicationStatusSAPController {

    constructor(private service: ApplicationStatusSAPService) { }

    @Get()
    getApplicationStatusSAP() {
        return this.service.getApplicationStatusSAP();
    }

    @Put()
    async updateApplicationStatusSAP(@Res() res: Response,@Body() applicationStatusSAP: ApplicationStatusSAP) : Promise<any>{
        await this.service.updateApplicationStatusSAP(applicationStatusSAP);
        res.status(200).json(applicationStatusSAP);
    }
}