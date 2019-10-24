import * as dotenv from 'dotenv'
import * as fs from 'fs'

export interface EnvData {
  // application
  APP_ENV: string

  // database
  DB_TYPE: 'mysql' | 'mariadb'
  DB_HOST?: string
  DB_DATABASE: string
  DB_PORT?: number
  DB_USERNAME: string
  DB_PASSWORD: string

  PORT: number
}

export class EnvService {
  private vars: EnvData

  constructor () {
    const environment = process.env.NODE_ENV || 'development'
    const data: any = dotenv.parse(fs.readFileSync(`env.${environment}`))

    data.APP_ENV = environment
    data.DB_PORT = parseInt(data.DB_PORT)

    this.vars = data as EnvData
  }

  read (): EnvData {
    return this.vars
  }

  // isDev (): boolean {
  //   return (this.vars.APP_ENV === 'development')
  // }

  // isProd (): boolean {
  //   return (this.vars.APP_ENV === 'production')
  // }
}
