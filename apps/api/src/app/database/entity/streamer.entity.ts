import { Column, Entity, Index, OneToMany, PrimaryColumn } from 'typeorm';
import Video from './video.entity';

@Entity('streamer')
export default class Streamer {

  @Index({ unique: true })
  @PrimaryColumn({ type: 'text', unique: true }) id: string;
  @Column('text') login: string;
  @Column('text') display_name: string;
  @Column('text') type: string;
  @Column({ type: 'text', nullable: true }) broadcaster_type: string;
  @Column('text') description: string;
  @Column({ type: 'text', unique: true }) profile_image_url: string;
  @Column({ type: 'text', unique: true }) offline_image_url: string;
  @Column('int') view_count: string;
  @Column('text') email: string;

  @OneToMany(() => Video, video => video.streamer)
  videos: Video[];

}
