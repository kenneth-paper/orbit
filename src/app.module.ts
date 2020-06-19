import { Module } from '@nestjs/common';
import { ApplicationStatusModule } from './applicationStatus/applicationStatus.module';
import { ApplicationStatusPayperModule } from './applicationStatusPayper/applicationStatusPayper.module';
import { DatabaseModule } from '../environment/database.module';

@Module({
  imports: [DatabaseModule, ApplicationStatusModule, ApplicationStatusPayperModule],
  controllers: [],
  providers: [],
})

export class AppModule { }
