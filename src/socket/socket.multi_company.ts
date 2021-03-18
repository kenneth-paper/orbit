import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({namespace: "/socket/multicompany"})
export class SocketMulti_company implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppSocketMultiCompany');

  // @UseGuards(SocketGuard)
  @SubscribeMessage('join')
  joinRoom(client: Socket, room: string) {
    client.join(room);
    return room;
  }

  // @UseGuards(InternalSocketGuard)
  @SubscribeMessage('seeding_status')
  qrisPaymentStatus(client: Socket, payload: any): void {
    console.log(payload.room)
    console.log("payload", payload)
    this.server.in(payload.room).emit('seeding_status', payload);
  }

  afterInit(server: Server) {

  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }
}

