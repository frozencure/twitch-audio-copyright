import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './config/typeorm-config.service';
import config from './config/config';
import { AuthModule } from './auth/auth.module';
import { VodDownloadModule } from './vod/vod-download.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ config ]
    }),
    AuthModule,
    VodDownloadModule
  ],
  controllers: [ AppController ],
  providers: [ AppService ]
})
export class AppModule {
}
