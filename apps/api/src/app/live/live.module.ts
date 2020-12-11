import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';
import { AcrCloudProcessingModule } from '../acr_cloud/acr-cloud-processing.module';
import { LiveController } from './live.controller';

@Module({
  controllers: [LiveController],
  imports: [
    DatabaseModule,
    AuthModule,
    AcrCloudProcessingModule
  ]
})
export class LiveModule {
}
