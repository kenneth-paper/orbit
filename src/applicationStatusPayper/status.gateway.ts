import { WebSocketGateway, WebSocketServer, OnGatewayConnection } from "@nestjs/websockets";
import { Server } from "socket.io";
import { Logger, Injectable, Inject, forwardRef } from "@nestjs/common";
import { ApplicationStatusPayperService } from "./applicationStatusPayper.service";

@WebSocketGateway()
@Injectable()
export class StatusGateway implements OnGatewayConnection {

  constructor(@Inject(forwardRef(()=>ApplicationStatusPayperService))private service: ApplicationStatusPayperService) {}

  @WebSocketServer() wss: Server;
  private logger: Logger = new Logger('StatusGateway');

  async handleConnection(client: any, ...args: any[]) {
    var result = await this.service.getApplicationStatus();
    if (!result.status){
      this.sendToAll('status',result);
    }
  }

  sendToAll(msg: string, data){
    this.logger.log(`StatusGateway -> sendToAll ${msg}`);
    this.logger.log(`StatusGateway -> sendToAll ${data}`);
    console.log(data);
    this.wss.emit(msg,data);
  }
}