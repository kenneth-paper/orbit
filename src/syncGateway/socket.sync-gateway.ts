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
    joinRoom(client: Socket, payload: any) {
      console.log(payload.room)
      client.join(String(payload.room));
      return payload;
    }
  
    // @UseGuards(InternalSocketGuard)
    @SubscribeMessage('syncStatus')
    syncStatus(client: Socket, payload: any): void {
      this.server.to(payload.room).emit('syncStatus', payload.data);
    }
   
    afterInit(server: Server) {
  
    }

    pushStatus(payload: any): boolean{
      var res= this.server.to(payload.room).emit('sync-status', { "event_type": payload.event_type,"data":payload.data});
      return res
    }

    
   
    handleDisconnect(client: Socket) {
     this.logger.log(`Client sync-gateway disconnected: ${client.id}`);
    }
   
    handleConnection(client: Socket, ...args: any[]) {
     this.logger.log(`Client sync-gateway connected: ${client.id}`);
    }
   }
  
  