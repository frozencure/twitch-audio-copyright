import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VodDownloadController } from './vod/vod-download-controller';
import { VodDownloadService } from './vod/vod-download-service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './config/typeorm-config.service';
import config from './config/config';

@Module({
  imports: [HttpModule.register({
    timeout: 50000,
    maxRedirects: 5
  }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService
    }),
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
      load: [config]
    })],
  controllers: [AppController, VodDownloadController],
  providers: [AppService, VodDownloadService]
})
export class AppModule {
}
