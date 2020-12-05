import { HttpModule, Module } from '@nestjs/common';
import { MusicbrainzService } from './musicbrainz.service';
import { MusicbrainzController } from './musicbrainz.controller';

@Module({
  providers: [MusicbrainzService],
  exports: [MusicbrainzService],
  controllers: [MusicbrainzController],
  imports: [
    HttpModule
  ]
})
export class MusicbrainzModule {
}
