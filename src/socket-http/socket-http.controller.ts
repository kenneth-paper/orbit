import { Controller, Post, Body, Res } from "@nestjs/common";
import { Response } from 'express';
import { EnvService } from '../../environment/env.service'
import * as WebSocket from "ws";
import * as io from "socket.io-client";

@Controller('socket-http')
export class SocketHttpController {

    @Post()
    postSocketData(@Res() res: Response,@Body() socketData: any) {
        var url = new EnvService().read().APP_URL
        url = url.concat(socketData.namespace)

        var emittedData = {
            event: socketData.message, 
            data: socketData.data,
        }

        const socket = io(url, {
            transports: ['websocket', 'polling', 'flashsocket'],
            cors: { origin: '*'}
            rejectUnauthorized: false
        });        
        socket.emit(socketData.message, socketData.data);

        res.status(200).json(emittedData)
    }
}