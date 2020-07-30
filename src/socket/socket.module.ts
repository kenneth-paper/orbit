import { Module, HttpModule } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';

@Module({
    imports: [
        HttpModule,
      ],
      providers: [SocketGateway],
      exports: [SocketGateway],
      controllers: [],
})
export class SocketModule {}