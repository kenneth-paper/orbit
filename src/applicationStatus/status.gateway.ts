import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayInit,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server,Socket } from "socket.io";
import { Logger, Injectable, Inject, forwardRef } from "@nestjs/common";
import { ApplicationStatusService } from "./applicationStatus.service";

@WebSocketGateway({transports: ['websocket']})
@Injectable()
export class StatusGateway implements OnGatewayInit,OnGatewayConnection,OnGatewayDisconnect {

  constructor(@Inject(forwardRef(()=>ApplicationStatusService))private service: ApplicationStatusService) {}

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('StatusGateway');

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  @SubscribeMessage("status")
  handleStatusMessage(payload: any) : void {
    this.logger.log('status gateway ' + payload)
    this.server.emit("status",payload)
  }

  async handleDisconnect(client: any) {
    await this.logger.log(`Client disconnected: ${client.id}`);
  }

  afterInit(server: any): any {

  }
}