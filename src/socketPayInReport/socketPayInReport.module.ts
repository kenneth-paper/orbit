import { Module, HttpModule } from '@nestjs/common';
import {  SocketPayInReport } from './socketPayInReport.gateway';

@Module({
    imports: [
        HttpModule,
      ],
      providers: [SocketPayInReport],
      exports: [SocketPayInReport],
})
export class SocketPayInExportModule {}
