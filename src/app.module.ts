import { Module,MiddlewareConsumer, HttpModule } from '@nestjs/common';
import { ApplicationStatusModule } from './applicationStatus/applicationStatus.module';
import { ApplicationStatusPayperModule } from './applicationStatusPayper/applicationStatusPayper.module';
import { DatabaseModule } from '../environment/database.module';
import {ApplicationStatusMiddleware} from './middlewares/applicationstatus.middleware';
import { SocketModule } from './socket/socket.module';
import { logger } from './middlewares/logger.middleware';
import { SyncGatewayModule } from './syncGateway/syncGateway.module';
import { SocketImportModule } from './socket-import/socket-import.module';
import { SocketExportModule } from './socket-export/socket-export.module';
import { PushNotificationModule } from './pushNotification/pushNotification.module';
import { SocketHttpModule } from './socket-http/socket-http.module';
import { SocketWorkflowModule } from './socketWorkflow/socketWorkflow.module';
import { SocketPayOutExportModule } from './socketPayOutReport/socketPayOutReport.module';
import { SocketPayInExportModule } from './socketPayInReport/socketPayInReport.module';
import { SocketDestroyModule } from './socket-destroy/socket-destroy.module';
import { SocketSubscriptionModule } from './socket-subscription/socket-subscription.module';


@Module({
  imports: [
    DatabaseModule, 
    ApplicationStatusModule,
    SyncGatewayModule,
    SocketModule,
    SocketImportModule,
    SocketExportModule,
    PushNotificationModule,
    HttpModule,
    SocketHttpModule,
    SocketWorkflowModule,
    SocketPayInExportModule,
    SocketPayOutExportModule,
    ApplicationStatusPayperModule,
    SocketDestroyModule,
    SocketSubscriptionModule,
    SocketPayInExportModule,
  ],
  controllers: [],
  providers: [],
})

export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ApplicationStatusMiddleware)
      .forRoutes('application-status','sync-gateway','push-notification','push-workflow')
      .apply(logger)
      .forRoutes('socket', 'socket-http');
  }
}
