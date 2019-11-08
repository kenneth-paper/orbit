import { Module, Global, DynamicModule } from '@nestjs/common'
import { EnvModule } from './env.module'
import { EnvService } from './env.service'
import { TypeOrmModule } from '@nestjs/typeorm'

function DatabaseOrmModule (): DynamicModule {
  const config = new EnvService().read()

  console.log("config: ", config)

  return TypeOrmModule.forRoot({
    type: config.DB_TYPE,
    host: config.DB_HOST,
    port: config.DB_PORT,
    username: config.DB_USERNAME,
    password: config.DB_PASSWORD,
    database: config.DB_DATABASE,
    entities: ["src/**/**.entity{.ts,.js}"],
    synchronize: true
  })
}

@Global()
@Module({
  imports: [
    EnvModule,
    DatabaseOrmModule()
  ]
})
export class DatabaseModule { }
