import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import User from '../user/user.entity';
import IdentifiedSong from '../identified-song/identified-song.entity';
import { TwitchClipDto } from '@twitch-audio-copyright/data';
import { ProcessingProgress } from '@twitch-audio-copyright/data';
import Video from '../video/video.entity';
import { UserActionType } from '@twitch-audio-copyright/data';

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
  @Column({ type: 'enum', enum: UserActionType, default: UserActionType.NO_ACTION_NEEDED }) userAction: UserActionType;

  @ManyToOne(() => User, user => user.clips)
  user: User;

  @OneToMany('IdentifiedSong', 'clip')
  identifiedSongs: IdentifiedSong[];

  @ManyToOne('Video', 'clips')
  video: Video;

  static FromTwitchClip(twitchClipDto: TwitchClipDto,
                        video: Video, user: User, progress = ProcessingProgress.QUEUED,
                        userActionType = UserActionType.NO_ACTION_NEEDED): Clip {
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
    clip.userAction = userActionType;
    return clip;
  }

}
