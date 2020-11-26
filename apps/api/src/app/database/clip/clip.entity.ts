import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import User from '../user/user.entity';
import IdentifiedSong from '../identified-song/identified-song.entity';
import Video, { VideoProgress, VideoType } from '../video/video.entity';

@Entity('clip')
export default class Clip extends BaseEntity {

  @PrimaryColumn({ type: 'text', unique: true }) id: string;
  @Column('title') title: string;
  @Column('text') embedUrl: string;
  @Column('text') creatorName: string;
  @Column('text') gameId: string;
  @Column('int') viewCount: number;
  @Column('timestamp') createdAt: Date;
  @Column('text') thumbnailUrl: string;


  @ManyToOne(() => User, user => user.videos)
  user: User;

  @OneToMany('IdentifiedSong', 'clip')
  identifiedSongs: IdentifiedSong[];

  @ManyToOne('Video', 'clips')
  video: Video;

}
