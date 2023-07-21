
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsException,
  WsResponse
 } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({namespace: "/socket/subscription"})
export class SocketSubscriptionGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
  
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');

  @SubscribeMessage('join')
  joinRoom(client: Socket, room: string): void {
    client.join(room, err => {
      if(err) {
        client.emit("error", err);
      } else {
        client.emit("Joined room " + room + " with id " + client.id);
      }
    });
  } 
  
  @SubscribeMessage('progress')
  progress(client: Socket, payload: any): void {
    console.log(payload.progress)
    this.server.in(payload.room).emit('progress', payload);
  }
 
  afterInit(server: Server) {

  }

  handleDisconnect(client: Socket) {
   this.logger.log(`Client disconnected: ${client.id}`);
   console.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
   this.logger.log(`Client connected: ${client.id}`);
  }
  
}
