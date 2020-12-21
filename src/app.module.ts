import { Module,MiddlewareConsumer, HttpModule } from '@nestjs/common';
import { ApplicationStatusModule } from './applicationStatus/applicationStatus.module';
import { ApplicationStatusPayperModule } from './applicationStatusPayper/applicationStatusPayper.module';
import { DatabaseModule } from '../environment/database.module';
import {ApplicationStatusMiddleware} from './middlewares/applicationstatus.middleware';
import { SocketModule } from './socket/socket.module';
import { logger } from './middlewares/logger.middleware';
import { SocketImportModule } from './socket-import/socket-import.module';


@Module({
  imports: [
    DatabaseModule, 
    ApplicationStatusModule,
    SocketModule,
    SocketImportModule,
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
      .forRoutes('application-status')
      .apply(logger)
      .forRoutes('socket');
  }
}
