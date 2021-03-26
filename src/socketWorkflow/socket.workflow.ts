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

 @WebSocketGateway({namespace: "/socket/push-workflow"})
 export class SocketWorkflow implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
 
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppSocketWorkflow');
 
  // @UseGuards(SocketGuard)
  @SubscribeMessage('join')
  joinRoom(client: Socket, payload: any) {
    console.log(payload)
    client.join(String(payload));
    return payload;
  }

  // @UseGuards(InternalSocketGuard)
  @SubscribeMessage('pushWorkflow')
  workflow(client: Socket, payload: any): void {
    this.server.to(payload.room).emit('pushWorkflow', payload.data);
  }
 
  afterInit(server: Server) {

  }

  pushWorkflow(payload: any): boolean{
    console.log(payload.room)
    var res= this.server.in(payload.room).emit('push-workflow', { "event_type": payload.event_type,"data":payload.data});
    return res
  }
 
  handleDisconnect(client: Socket) {
   this.logger.log(`Client socket workflow disconnected: ${client.id}`);
  }
 
  handleConnection(client: Socket, ...args: any[]) {
   this.logger.log(`Client socket workflow connected: ${client.id}`);
  }
 }

