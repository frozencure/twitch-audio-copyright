import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './config/typeorm-config.service';
import config from './config/config';
import { AuthModule } from './auth/auth.module';
import { VodDownloadModule } from './vod/vod-download.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ config ]
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('redis.host'),
          port: +configService.get('redis.port'),
        },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    VodDownloadModule,
  ],
  controllers: [ AppController ],
  providers: [ AppService ]
})
export class AppModule {
}
