import { Module, HttpModule } from '@nestjs/common';
import {  SocketExportGateway } from './socket-export.gateway';

@Module({
    imports: [
        HttpModule,
      ],
      providers: [SocketExportGateway],
      exports: [SocketExportGateway],
})
export class SocketExportModule {}
