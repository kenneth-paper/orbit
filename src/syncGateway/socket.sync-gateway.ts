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
  
   @WebSocketGateway({namespace: "/socket/sync-gateway"})
   export class SocketSyncGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
   
    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('AppSyncGateway');
   
    // @UseGuards(SocketGuard)
    @SubscribeMessage('join')
    joinRoom(client: Socket, room: string) {
      client.join(room);
      return room;
    }
  
    // @UseGuards(InternalSocketGuard)
    @SubscribeMessage('sync-status')
    syncStatus(client: Socket, payload: any): void {
      console.log(payload)
      this.server.in(payload.room).emit('sync-status', payload.data);
    }
   
    afterInit(server: Server) {
  
    }

    async handlePushStatus(payload: any): Promise<boolean>{
      console.log(payload)
      let res= this.server.in(payload.room).emit('sync-status', payload.data);
      return res
    }
   
    handleDisconnect(client: Socket) {
     this.logger.log(`Client sync-gateway disconnected: ${client.id}`);
    }
   
    handleConnection(client: Socket, ...args: any[]) {
     this.logger.log(`Client sync-gateway connected: ${client.id}`);
    }
   }
  
  