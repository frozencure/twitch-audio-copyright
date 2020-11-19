import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Streamer from './entity/streamer.entity';
import Album from './entity/album.entity';
import Artist from './entity/artist.entity';
import IdentifiedSong from './entity/identified-song.entity';
import Label from './entity/label.entity';
import Video from './entity/video.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Album, Artist,
    IdentifiedSong, Label, Streamer, Video]), HttpModule],
  providers: [],
  exports: []
})
export class DatabaseModule {
}
