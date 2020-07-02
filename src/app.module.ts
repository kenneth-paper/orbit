import { Module,MiddlewareConsumer } from '@nestjs/common';
import { ApplicationStatusModule } from './applicationStatus/applicationStatus.module';
import { ApplicationStatusPayperModule } from './applicationStatusPayper/applicationStatusPayper.module';
import { DatabaseModule } from '../environment/database.module';
import {ApplicationStatusMiddleware} from './middlewares/applicationstatus.middleware';

@Module({
  imports: [DatabaseModule, ApplicationStatusModule, ApplicationStatusPayperModule],
  controllers: [],
  providers: [],
})

export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ApplicationStatusMiddleware)
      .forRoutes('application-status');
  }
}
