import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import UserEntity from '../user/user.entity';
import IdentifiedSongEntity from '../identified-song/identified-song.entity';
import { ProcessingProgress, TwitchVideoDto, UserActionType, VideoType } from '@twitch-audio-copyright/data';

@Entity('video')
export default class VideoEntity extends BaseEntity {

  @PrimaryColumn({ type: 'int', unique: true }) id: number;
  @Column('text') title: string;
  @Column({ type: 'text', nullable: true }) description: string;
  @Column({ type: 'enum', enum: VideoType, default: VideoType.ARCHIVE }) type: VideoType;
  @Column('text') url: string;
  @Column('text') thumbnailUrl: string;
  @Column('int') views: number;
  @Column('boolean') isPublic: boolean;
  @Column('int') durationInSeconds: number;
  @Column('text') language: string;
  @Column('timestamp') createdAt: Date;
  @Column('timestamp') publishedAt: Date;
  @Column({ type: 'enum', enum: ProcessingProgress, default: ProcessingProgress.QUEUED }) progress: ProcessingProgress;
  @Column({ type: 'enum', enum: UserActionType, default: UserActionType.NO_ACTION_NEEDED }) userAction: UserActionType;

  @ManyToOne(() => UserEntity, user => user.videos)
  user: UserEntity;

  @OneToMany(() => IdentifiedSongEntity, identifiedSong => identifiedSong.video)
  identifiedSongs: IdentifiedSongEntity[];

  static FromTwitchVideo(videoDto: TwitchVideoDto, user: UserEntity, progress = ProcessingProgress.QUEUED,
                         userActionType = UserActionType.NO_ACTION_NEEDED): VideoEntity {
    const video = new VideoEntity();
    video.id = videoDto.id;
    video.title = videoDto.title;
    video.description = videoDto.description;
    video.type = videoDto.type;
    video.url = videoDto.url;
    video.views = videoDto.view_count;
    video.isPublic = videoDto.viewable === 'public';
    video.durationInSeconds = videoDto.durationInSeconds;
    video.language = videoDto.language;
    video.createdAt = videoDto.created_at;
    video.publishedAt = videoDto.published_at;
    video.thumbnailUrl = videoDto.thumbnail_url;
    video.user = user;
    video.progress = progress;
    video.userAction = userActionType;
    return video;
  }
}
