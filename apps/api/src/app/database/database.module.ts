import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from './user/user.entity';
import Album from './entity/album.entity';
import Artist from './entity/artist.entity';
import IdentifiedSong from './identified-song/identified-song.entity';
import Label from './entity/label.entity';
import Video from './video/video.entity';
import { UsersService } from './user/users.service';
import { VideosService } from './video/videos.service';
import { IdentifiedSongsService } from './identified-song/identified-songs.service';
import { ClipsService } from './clip/clips.service';
import Clip from './clip/clip.entity';
import { MusicbrainzModule } from '../musicbrainz/musicbrainz.module';
import LabelMetadata from './entity/label-metadata.entity';
import { StreamMonitorService } from './stream-monitor/stream-monitor-service';
import { StreamMonitor } from './stream-monitor/stream-monitor-entity';

@Module({
  imports: [TypeOrmModule.forFeature([Album, Artist,
    IdentifiedSong, Label, Video, User, Clip, LabelMetadata, StreamMonitor]), HttpModule, MusicbrainzModule],
  providers: [UsersService, VideosService,
    IdentifiedSongsService, ClipsService, StreamMonitorService],
  exports: [UsersService, VideosService,
    IdentifiedSongsService, ClipsService, StreamMonitorService]
})
export class DatabaseModule {
}
