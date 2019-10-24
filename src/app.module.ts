import { Module } from '@nestjs/common';
import { ApplicationStatusModule } from './applicationStatus/applicationStatus.module';
import { DatabaseModule } from 'environment/database.module';

@Module({
  imports: [DatabaseModule, ApplicationStatusModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
