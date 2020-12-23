import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import UserEntity from '../user/user.entity';
import IdentifiedSongEntity from '../identified-song/identified-song.entity';
import { ProcessingProgress, TwitchClipDto, UserActionType } from '@twitch-audio-copyright/data';

@Entity('clip')
export default class ClipEntity extends BaseEntity {

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

  @ManyToOne(() => UserEntity, user => user.clips)
  user: UserEntity;

  @OneToMany(() => IdentifiedSongEntity, identifiedSong => identifiedSong.clip)
  identifiedSongs: IdentifiedSongEntity[];

  static FromTwitchClip(twitchClipDto: TwitchClipDto, user: UserEntity, progress = ProcessingProgress.QUEUED,
                        userActionType = UserActionType.NO_ACTION_NEEDED): ClipEntity {
    const clip = new ClipEntity();
    clip.id = twitchClipDto.id;
    clip.title = twitchClipDto.title;
    clip.embedUrl = twitchClipDto.embed_url;
    clip.creatorName = twitchClipDto.creator_name;
    clip.gameId = twitchClipDto.game_id;
    clip.viewCount = twitchClipDto.view_count;
    clip.createdAt = twitchClipDto.created_at;
    clip.thumbnailUrl = twitchClipDto.thumbnail_url;
    clip.user = user;
    clip.progress = progress;
    clip.userAction = userActionType;
    return clip;
  }
}
