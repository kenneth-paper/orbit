import { Module, HttpModule } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { SocketPaperChain } from './socket.paperchain';
import { SocketPayper } from './socket.payper';
import { SocketSyncGateway } from '../syncGateway/socket.sync-gateway';
import { SocketMulti_company } from './socket.multi_company';

@Module({
    imports: [
        HttpModule,
      ],
      providers: [
        SocketGateway,
        SocketPayper,
        SocketPaperChain,
        SocketMulti_company,
      ],
      exports: [
        SocketGateway,
        SocketPayper,
        SocketPaperChain,
        SocketMulti_company,
      ],
      controllers: [],
})
export class SocketModule {}
