import { Module,MiddlewareConsumer, HttpModule } from '@nestjs/common';
import { ApplicationStatusModule } from './applicationStatus/applicationStatus.module';
import { ApplicationStatusPayperModule } from './applicationStatusPayper/applicationStatusPayper.module';
import { DatabaseModule } from '../environment/database.module';
import {ApplicationStatusMiddleware} from './middlewares/applicationstatus.middleware';
import { SocketModule } from './socket/socket.module';
import { logger } from './middlewares/logger.middleware';
import { SyncGatewayModule } from './syncGateway/syncGateway.module';
import { SocketImportModule } from './socket-import/socket-import.module';
import { PushNotificationModule } from './pushNotification/pushNotification.module';


@Module({
  imports: [
    DatabaseModule, 
    ApplicationStatusModule,
    SyncGatewayModule,
    SocketModule,
    SocketImportModule,
    PushNotificationModule,
    HttpModule,
    ApplicationStatusPayperModule,
  ],
  controllers: [],
  providers: [],
})

export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ApplicationStatusMiddleware)
      .forRoutes('application-status','sync-gateway','push-notification')
      .apply(logger)
      .forRoutes('socket');
  }
}
