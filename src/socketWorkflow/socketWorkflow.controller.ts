import { Controller, Get, Put, Body, Res, Post, HttpStatus } from "@nestjs/common";
import { SocketWorkflowService } from "./socketWorkflow.service";
import { Response } from 'express';

@Controller('push-notification')
export class SocketWorkflowController {

    constructor(private service: SocketWorkflowService) { }

    @Post("/status")
    async sendSocketWorkflow(@Res() res: Response,@Body() req: any) : Promise<any>{
        var result = await this.service.sendSocketWorkflow(req);
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