import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import User from '../user/user.entity';
import IdentifiedSong from '../entity/identified-song.entity';


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
export default class Video {

  @Index({ unique: true })
  @PrimaryColumn({ type: 'int', unique: true }) id: number;
  @Column('text') title: string;
  @Column({ type: 'text', nullable: true }) description: string;
  @Column({ type: 'enum', enum: VideoType, default: VideoType.ARCHIVE }) type: VideoType;
  @Column('text') url: string;
  @Column('int') views: number;
  @Column('text') viewable: string;
  @Column('int') durationInSeconds: number;
  @Column('text') language: string;
  @Column('timestamp') createdAt: Date;
  @Column('timestamp') publishedAt: Date;
  @Column({ type: 'enum', enum: VideoProgress, default: VideoProgress.QUEUED }) progress: VideoProgress;

  @ManyToOne(() => User, user => user.videos)
  user: User;

  @OneToMany('IdentifiedSong', 'video')
  identifiedSongs: IdentifiedSong[];

}