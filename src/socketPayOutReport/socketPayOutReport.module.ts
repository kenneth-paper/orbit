import { Module, HttpModule } from '@nestjs/common';
import {  SocketPayOutReport } from './socketPayOutReport.gateway';

@Module({
    imports: [
        HttpModule,
      ],
      providers: [SocketPayOutReport],
      exports: [SocketPayOutReport],
})
export class SocketImportModule {}
