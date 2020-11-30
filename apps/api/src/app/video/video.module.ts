import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { VideoController } from './video.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [VideoController],
  imports: [
    DatabaseModule,
    AuthModule
  ]
})
export class VideoModule {
}
