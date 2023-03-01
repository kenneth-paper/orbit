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
  
   @WebSocketGateway({namespace: "/socket/download", transports: ['websocket']})
   export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
   
    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('AppGateway');
   
    // @UseGuards(SocketGuard)
    @SubscribeMessage('join')
    joinRoom(client: Socket, room: string) {
      client.join(room);
      return room;
    }
  
    // @UseGuards(InternalSocketGuard)
    @SubscribeMessage('progress')
    progress(client: Socket, payload: any): void {
      console.log(payload.progress)
      this.server.in(payload.room).emit('progress', payload);
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
  
  