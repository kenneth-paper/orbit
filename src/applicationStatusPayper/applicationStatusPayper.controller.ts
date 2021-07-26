import { Controller, Get, Put, Body, Res } from "@nestjs/common";
import { ApplicationStatusPayperService } from "./applicationStatusPayper.service";
import { ApplicationStatusPayper } from "./applicationStatusPayper.entity";
import { Response } from 'express';

@Controller('application-status/payper')
export class ApplicationStatusPayperController {

    constructor(private service: ApplicationStatusPayperService) { }

    @Get()
    getApplicationStatusPayper() {
        return this.service.getApplicationStatusPayper();
    }

    @Put()
    async updateApplicationStatusPayper(@Res() res: Response,@Body() applicationStatusPayper: ApplicationStatusPayper) : Promise<any>{
        await this.service.updateApplicationStatusPayper(applicationStatusPayper);
        res.status(200).json(applicationStatusPayper);
    }
}