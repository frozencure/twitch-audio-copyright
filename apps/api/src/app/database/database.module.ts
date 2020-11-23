import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from './user/user.entity';
import Album from './entity/album.entity';
import Artist from './entity/artist.entity';
import IdentifiedSong from './entity/identified-song.entity';
import Label from './entity/label.entity';
import Video from './entity/video.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Album, Artist,
    IdentifiedSong, Label, Video, User]), HttpModule],
  providers: [],
  exports: []
})
export class DatabaseModule {
}
