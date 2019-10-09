import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationStatusModule } from './applicationStatus/applicationStatus.module';

@Module({
  imports: [TypeOrmModule.forRoot(), ApplicationStatusModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
