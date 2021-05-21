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

@WebSocketGateway({namespace: "/socket/importinvoice"})
export class SocketImportGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
  
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

  @SubscribeMessage('upload_invoice')
  uploadInvoice(client: Socket, payload: any): void {
    console.log('upload_invoice room ' + payload.room + " : "  + payload.progress);
    try {
      client.to(payload.room).broadcast.emit('upload_invoice', payload);
    } catch(err){
      this.logger.log(err);
    }
  }

  @SubscribeMessage('import_invoice')
  importInvoice(client: Socket, payload: any): void {
    console.log('import_invoice ' + payload.progress);
    try {
      client.to(payload.room).broadcast.emit('import_invoice', payload);
    } catch(err){
      this.logger.log(err);
    }
  }
 
  @SubscribeMessage('validate_invoice')
  validateInvoice(client: Socket, payload: any): void {
    console.log('validate_invoice ' + payload.progress);    
    try {
      client.to(payload.room).broadcast.emit('validate_invoice', payload);
    } catch(err){
      this.logger.log(err);
    }
  }

  @SubscribeMessage('send_invoice')
  sendInvoice(client: Socket, payload: any): void {
    console.log('send_invoice ' + payload.progress);
    try {
      client.to(payload.room).broadcast.emit('send_invoice', payload);
    } catch(err){
      this.logger.log(err);
    }
  }

  @SubscribeMessage('upload_ocr')
  uploadOCR(client: Socket, payload: any): void {
    console.log('upload_ocr ' + payload.progress);
    try {
      client.to(payload.room).broadcast.emit('upload_ocr', payload);
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
