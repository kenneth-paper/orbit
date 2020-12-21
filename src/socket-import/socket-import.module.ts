import { Module, HttpModule } from '@nestjs/common';
import {  SocketImportGateway } from './socket-import.gateway';

@Module({
    imports: [
        HttpModule,
      ],
      providers: [SocketImportGateway],
      exports: [SocketImportGateway],
})
export class SocketImportModule {}
