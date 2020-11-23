import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from './user/user.entity';
import Album from './entity/album.entity';
import Artist from './entity/artist.entity';
import IdentifiedSong from './entity/identified-song.entity';
import Label from './entity/label.entity';
import Video from './video/video.entity';
import { UsersService } from './user/users.service';
import { VideosService } from './video/VideosService';

@Module({
  imports: [TypeOrmModule.forFeature([Album, Artist,
    IdentifiedSong, Label, Video, User]), HttpModule],
  providers: [UsersService, VideosService],
  exports: [UsersService, VideosService]
})
export class DatabaseModule {
}
