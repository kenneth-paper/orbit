import { Module, HttpModule } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { SocketPaperChain } from './socket.paperchain';
import { SocketPayper } from './socket.payper';
import { SocketSyncGateway } from '../syncGateway/socket.sync-gateway';
import { SocketMultiCompany } from './socket.multicompany';

@Module({
    imports: [
        HttpModule,
      ],
      providers: [
        SocketGateway,
        SocketPayper,
        SocketPaperChain,
        SocketMultiCompany,
      ],
      exports: [
        SocketGateway,
        SocketPayper,
        SocketPaperChain,
        SocketMultiCompany,
      ],
      controllers: [],
})
export class SocketModule {}
