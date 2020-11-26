import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import User from '../user/user.entity';
import IdentifiedSong from '../identified-song/identified-song.entity';
import Clip from '../clip/clip.entity';

import { HelixVideo } from 'twitch';

export enum VideoType {
  UPLOAD = 'upload',
  ARCHIVE = 'archive',
  HIGHLIGHT = 'highlight'
}

export enum VideoProgress {
  QUEUED = 'queued',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed'
}

@Entity('video')
export default class Video extends BaseEntity {

  @PrimaryColumn({ type: 'int', unique: true }) id: number;
  @Column('text') title: string;
  @Column({ type: 'text', nullable: true }) description: string;
  @Column({ type: 'enum', enum: VideoType, default: VideoType.ARCHIVE }) type: VideoType;
  @Column('text') url: string;
  @Column('int') views: number;
  @Column('boolean') isPublic: boolean;
  @Column('int') durationInSeconds: number;
  @Column('text') language: string;
  @Column('timestamp') createdAt: Date;
  @Column('timestamp') publishedAt: Date;
  @Column({ type: 'enum', enum: VideoProgress, default: VideoProgress.QUEUED }) progress: VideoProgress;

  @ManyToOne(() => User, user => user.videos)
  user: User;

  @OneToMany('IdentifiedSong', 'video')
  identifiedSongs: IdentifiedSong[];

  @OneToMany('Clip', 'video')
  clips: Clip[];

  static FromTwitchVideo(videoDto: HelixVideo, user: User, progress = VideoProgress.QUEUED): Video {
    const video = new Video();
    video.id = Number.parseInt(videoDto.id);
    video.title = videoDto.title;
    video.description = videoDto.description;
    video.type = VideoType[videoDto.type.toString()];
    video.url = videoDto.url;
    video.views = videoDto.views;
    video.isPublic = videoDto.isPublic;
    video.durationInSeconds = videoDto.durationInSeconds;
    video.language = videoDto.language;
    video.createdAt = videoDto.creationDate;
    video.publishedAt = videoDto.publishDate;
    video.user = user;
    video.progress = progress;
    return video;
  }
}
