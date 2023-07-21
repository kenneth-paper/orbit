import { Module, HttpModule } from '@nestjs/common';
import {  SocketSubscriptionGateway } from './socket-subscription.gateway';

@Module({
    imports: [
        HttpModule,
      ],
      providers: [SocketSubscriptionGateway],
      exports: [SocketSubscriptionGateway],
})
export class SocketSubscriptionModule {}
