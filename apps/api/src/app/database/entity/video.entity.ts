import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import Streamer from './streamer.entity';
import IdentifiedSong from './identified-song.entity';

@Entity('video')
export default class Video {

  @Index({ unique: true })
  @PrimaryColumn({ type: 'int', unique: true }) id: number;
  @Column('text') title: string;
  @Column({ type: 'text', nullable: true }) description: string;
  @Column('text') type: string;
  @Column('text') url: string;
  @Column('int') views: number;
  @Column('text') viewable: string;
  @Column('int') durationInSeconds: number;
  @Column('text') language: string;
  @Column('timestamp') createdAt: Date;
  @Column('timestamp') publishedAt: Date;

  @ManyToOne(() => Streamer, streamer => streamer.videos)
  streamer: Streamer;

  @OneToMany(() => IdentifiedSong, song => song.video)
  identifiedSongs: IdentifiedSong[];

}
