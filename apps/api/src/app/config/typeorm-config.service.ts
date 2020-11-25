import { Injectable, Logger } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import User from '../database/user/user.entity';
import { ConfigService } from '@nestjs/config';
import Artist from '../database/entity/artist.entity';
import IdentifiedSong from '../database/identified-song/identified-song.entity';
import Video from '../database/video/video.entity';
import Label from '../database/entity/label.entity';
import Album from '../database/entity/album.entity';

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
      entities: [ Album, Artist, IdentifiedSong, Label, User, Video ],
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
