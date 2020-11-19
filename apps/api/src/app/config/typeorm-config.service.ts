import { Injectable, Logger } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import Streamer from '../database/entity/streamer.entity';
import { ConfigService } from '@nestjs/config';

export enum DBTypes {
  postgres = 'postgres',
}

export enum Environment {
  production = 'prd',
  development = 'dev',
  test = 'test',
}

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {
  }

  get getTypeOrmConfig(): TypeOrmModuleOptions {

    const typeormConfig = {
      type: DBTypes[this.configService.get('database.type')],
      host: this.configService.get<string>('database.host'),
      port: this.configService.get<number>('database.port'),
      username: this.configService.get<string>('database.username'),
      password: this.configService.get<string>('database.password'),
      database: this.configService.get<string>('database.name'),
      entities: [ Streamer ],
      ssl: this.configService.get<string>('database.ssl'),

      logging: true,
      synchronize: true,
      autoLoadEntities: true
    };
    Logger.debug(typeormConfig);
    return typeormConfig;
  }

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return this.getTypeOrmConfig;
  }
}
