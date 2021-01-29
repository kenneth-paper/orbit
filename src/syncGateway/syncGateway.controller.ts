import { Controller, Get, Put, Body, Res, Post, HttpStatus } from "@nestjs/common";
import { SyncGatewayService } from "./syncGateway.service";
import { Response } from 'express';

@Controller('sync-gateway')
export class SyncGatewayController {

    constructor(private service: SyncGatewayService) { }

    @Post("/status")
    async sendSyncStatus(@Res() res: Response,@Body() req: any) : Promise<any>{
        var result = await this.service.pushSyncStatus(req);
        if (result){
            res.status(HttpStatus.OK).json(
                {
                    status_code: HttpStatus.OK,
                    message: "message sent"
                }
            )
        }else{
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                status_code: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "failed when sending message"
            });
        }
    }
}