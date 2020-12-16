import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';
import { AcrCloudProcessingModule } from '../acr_cloud/acr-cloud-processing.module';
import { LiveController } from './live.controller';
import { MusicbrainzModule } from '../musicbrainz/musicbrainz.module';
import { TwitchModule } from '../twitch/twitch.module';
import { LiveService } from './live.service';

@Module({
  controllers: [LiveController],
  providers: [LiveService],
  imports: [
    DatabaseModule,
    AuthModule,
    AcrCloudProcessingModule,
    MusicbrainzModule,
    TwitchModule
  ]
})
export class LiveModule {
}
