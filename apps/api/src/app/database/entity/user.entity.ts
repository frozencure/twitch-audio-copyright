import { Column, Entity, Index, OneToMany, PrimaryColumn } from 'typeorm';
import Video from './video.entity';

export enum BroadcasterType {
  PARTNER = 'partner',
  AFFILIATE = 'affiliate',
  NO_TITLE = ''
}

export enum UserType {
  STAFF = 'staff',
  ADMIN = 'admin',
  MOD = 'global_mod',
  NO_TITLE = ''
}


@Entity('user')
export default class User {

  @Index({ unique: true })
  @PrimaryColumn({ type: 'text', unique: true }) id: string;
  @Column('text') login: string;
  @Column('text') display_name: string;
  @Column({ type: 'enum', enum: UserType, default: UserType.NO_TITLE }) type: UserType;
  @Column({ type: 'enum', enum: BroadcasterType, default: BroadcasterType.NO_TITLE }) broadcaster_type: BroadcasterType;
  @Column('text') description: string;
  @Column({ type: 'text', unique: true }) profile_image_url: string;
  @Column({ type: 'text', unique: true }) offline_image_url: string;
  @Column('int') view_count: string;
  @Column('text') email: string;

  @OneToMany('Video', 'user')
  videos: Video[];
}
