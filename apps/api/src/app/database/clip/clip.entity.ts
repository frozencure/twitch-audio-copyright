import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import User from '../user/user.entity';
import IdentifiedSong from '../identified-song/identified-song.entity';
import { ClipDto } from '@twitch-audio-copyright/data';
import { ProcessingProgress } from '../processing-progress';
import Video from '../video/video.entity';

@Entity('clip')
export default class Clip extends BaseEntity {

  @PrimaryColumn({ type: 'text', unique: true }) id: string;
  @Column('text') title: string;
  @Column('text') embedUrl: string;
  @Column('text') creatorName: string;
  @Column('text') gameId: string;
  @Column('int') viewCount: number;
  @Column('timestamp') createdAt: Date;
  @Column('text') thumbnailUrl: string;
  @Column({ type: 'enum', enum: ProcessingProgress, default: ProcessingProgress.QUEUED }) progress: ProcessingProgress;


  @ManyToOne(() => User, user => user.videos)
  user: User;

  @OneToMany('IdentifiedSong', 'clip')
  identifiedSongs: IdentifiedSong[];

  @ManyToOne('Video', 'clips')
  video: Video;

  static FromTwitchClip(twitchClipDto: ClipDto,
                        video: Video, user: User, progress = ProcessingProgress.QUEUED): Clip {
    const clip = new Clip();
    clip.id = twitchClipDto.id;
    clip.title = twitchClipDto.title;
    clip.embedUrl = twitchClipDto.embed_url;
    clip.creatorName = twitchClipDto.creator_name;
    clip.gameId = twitchClipDto.game_id;
    clip.viewCount = twitchClipDto.view_count;
    clip.createdAt = twitchClipDto.created_at;
    clip.thumbnailUrl = twitchClipDto.thumbnail_url;
    clip.user = user;
    clip.video = video;
    clip.progress = progress;
    return clip;
  }

}
