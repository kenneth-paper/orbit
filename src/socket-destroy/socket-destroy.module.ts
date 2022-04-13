import { Module, HttpModule } from '@nestjs/common';
import {  SocketDestroyGateway } from './socket-destroy.gateway';

@Module({
  imports: [
    HttpModule,
  ],
  providers: [SocketDestroyGateway],
  exports: [SocketDestroyGateway],
})
export class SocketDestroyModule {}
