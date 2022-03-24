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
  
  @WebSocketGateway({namespace: "/socket/pay-in-report"})
  export class SocketPayInReport implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
    
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
    downloadProgress(client: Socket, payload: any): void {
      console.log('pay out report ' + payload.room + " : "  + payload.progress);
      try {
        client.to(payload.room).broadcast.emit('progress', payload);
      } catch(err){
        this.logger.log(err);
      }
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
  