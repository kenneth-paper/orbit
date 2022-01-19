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
  
   @WebSocketGateway({namespace: "/socket/payper"})
   export class SocketPayper implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
   
    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('AppSocketPayper');
   
    // @UseGuards(SocketGuard)
    @SubscribeMessage('join')
    joinRoom(client: Socket, room: string) {
      client.join(room);
      return room;
    }
  
    // @UseGuards(InternalSocketGuard)
    @SubscribeMessage('paymentStatus')
    qrisPaymentStatus(client: Socket, payload: any): void {
      console.log(payload.room)
      console.log("payload", payload)
      this.server.in(payload.room).emit('paymentStatus', payload);
    }

    @SubscribeMessage('invoiceStatus')
    invoiceStatus(client: Socket, payload: any): void {
      console.log(payload.room)
      console.log("payload", payload)
      this.server.in(payload.room).emit('invoiceStatus', payload);
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
  
  