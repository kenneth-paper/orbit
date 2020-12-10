import { Module, HttpModule } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { SocketPaperChain } from './socket.paperchain';
import { SocketPayper } from './socket.payper';

@Module({
    imports: [
        HttpModule,
      ],
      providers: [
        SocketGateway,
        SocketPayper
      ],
      exports: [
        SocketGateway,
        SocketPayper,
        SocketPaperChain
      ],
      controllers: [],
})
export class SocketModule {}