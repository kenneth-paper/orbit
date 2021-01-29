import { Module, HttpModule } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { SocketPaperChain } from './socket.paperchain';
import { SocketPayper } from './socket.payper';
import { SocketSyncGateway } from '../syncGateway/socket.sync-gateway';

@Module({
    imports: [
        HttpModule,
      ],
      providers: [
        SocketGateway,
        SocketPayper,
        SocketPaperChain,
      ],
      exports: [
        SocketGateway,
        SocketPayper,
        SocketPaperChain,
      ],
      controllers: [],
})
export class SocketModule {}