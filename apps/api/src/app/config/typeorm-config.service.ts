import { Injectable, Logger } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import UserEntity from '../database/user/user.entity';
import { ConfigService } from '@nestjs/config';
import ArtistEntity from '../database/entity/artist.entity';
import IdentifiedSongEntity from '../database/identified-song/identified-song.entity';
import VideoEntity from '../database/video/video.entity';
import LabelEntity from '../database/entity/label.entity';
import AlbumEntity from '../database/entity/album.entity';
import ClipEntity from '../database/clip/clip.entity';
import LabelMetadataEntity from '../database/entity/label-metadata.entity';
import { StreamMonitorEntity } from '../database/stream-monitor/stream-monitor-entity';

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
      entities: [AlbumEntity, ArtistEntity, IdentifiedSongEntity,
        LabelEntity, UserEntity, VideoEntity, ClipEntity, LabelMetadataEntity,
        StreamMonitorEntity],
      ssl: this.configService.get<string>('database.ssl'),

      logging: true,
      synchronize: true,
      autoLoadEntities: true
    };
    return typeormConfig;
  }

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return this.getTypeOrmConfig;
  }
}
