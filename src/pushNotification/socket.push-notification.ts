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

 @WebSocketGateway({namespace: "/socket/push-notification"})
 export class SocketPushNotification implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
 
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppPushNotification');
 
  // @UseGuards(SocketGuard)
  @SubscribeMessage('join')
  joinRoom(client: Socket, payload: any) {
    console.log(payload.room)
    client.join(String(payload.room));
    return payload;
  }

  // @UseGuards(InternalSocketGuard)
  @SubscribeMessage('pushNotification')
  notification(client: Socket, payload: any): void {
    this.server.to(payload.room).emit('pushNotification', payload.data);
  }
 
  afterInit(server: Server) {

  }

  @SubscribeMessage('push-notification')
  pushNotification(payload: any): boolean{
    var res= this.server.to(payload.room).emit('push-notification', { "event_type": payload.event_type,"data":payload.data});
    return res
  }
 
  handleDisconnect(client: Socket) {
   this.logger.log(`Client push-notification disconnected: ${client.id}`);
  }
 
  handleConnection(client: Socket, ...args: any[]) {
   this.logger.log(`Client push-notification connected: ${client.id}`);
  }
 }

