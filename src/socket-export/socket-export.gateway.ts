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
  
  @WebSocketGateway({namespace: "/socket/export"})
  export class SocketExportGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
    
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
  
    @SubscribeMessage('export_disbursement_fi')
    exportDisbursement(client: Socket, payload: any): void {
      console.log('export_disbursement_fi ' + payload.progress);
      try {
        client.to(payload.room).broadcast.emit('export_disbursement_fi', payload);
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
  