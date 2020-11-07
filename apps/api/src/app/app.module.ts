import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './config/typeorm-config.service';
import config from './config/config';

@Module({
  imports: [ TypeOrmModule.forRootAsync({
    useClass: TypeOrmConfigService
  }),
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
      load: [ config ]
    })
  ],
  controllers: [ AppController ],
  providers: [ AppService ]
})
export class AppModule {
}
