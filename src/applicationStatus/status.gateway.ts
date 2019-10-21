import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { Logger } from "@nestjs/common";

@WebSocketGateway()
export class StatusGateway {
  @WebSocketServer() wss: Server;
  private logger: Logger = new Logger('StatusGateway');
  sendToAll(msg: string){
    this.logger.log(`StatusGateway -> sendToAll ${msg}`);
    this.wss.emit(msg);
  }
}