import { Controller, Post, Body, Res } from "@nestjs/common";
import { Response } from 'express';
import { EnvService } from '../../environment/env.service'
import * as WebSocket from "ws";
import * as io from "socket.io-client";
import * as cluster from "cluster";
import * as os from "os";

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

        if (cluster.isMaster) {
            // Fork workers based on the number of CPUs
            const numCPUs = os.cpus().length;
            for (let i = 0; i < numCPUs; i++) {
                cluster.fork();
            }
        } else {
            // Each worker process handles its own socket connections
            const socket = io(url, {
                transports: ['websocket','polling'],
                rejectUnauthorized: false
            });        
            socket.emit(socketData.message, socketData.data);
        }

        res.status(200).json(emittedData)
    }
}
