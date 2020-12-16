import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserEntity from './user/user.entity';
import AlbumEntity from './entity/album.entity';
import ArtistEntity from './entity/artist.entity';
import IdentifiedSongEntity from './identified-song/identified-song.entity';
import LabelEntity from './entity/label.entity';
import VideoEntity from './video/video.entity';
import { UsersService } from './user/users.service';
import { VideosService } from './video/videos.service';
import { IdentifiedSongsService } from './identified-song/identified-songs.service';
import { ClipsService } from './clip/clips.service';
import ClipEntity from './clip/clip.entity';
import { MusicbrainzModule } from '../musicbrainz/musicbrainz.module';
import LabelMetadataEntity from './entity/label-metadata.entity';
import { StreamMonitorService } from './stream-monitor/stream-monitor-service';
import { StreamMonitorEntity } from './stream-monitor/stream-monitor-entity';

@Module({
  imports: [TypeOrmModule.forFeature([AlbumEntity, ArtistEntity,
    IdentifiedSongEntity, LabelEntity, VideoEntity, UserEntity, ClipEntity, LabelMetadataEntity, StreamMonitorEntity]), HttpModule, MusicbrainzModule],
  providers: [UsersService, VideosService,
    IdentifiedSongsService, ClipsService, StreamMonitorService],
  exports: [UsersService, VideosService,
    IdentifiedSongsService, ClipsService, StreamMonitorService]
})
export class DatabaseModule {
}
