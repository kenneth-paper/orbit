import { Module, HttpModule } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
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
        SocketPayper
      ],
      controllers: [],
})
export class SocketModule {}