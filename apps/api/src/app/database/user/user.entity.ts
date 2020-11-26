import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import Video from '../video/video.entity';
import { HelixBroadcasterType, HelixUserType } from 'twitch';

@Entity('user')
export default class User extends BaseEntity {

  @PrimaryColumn({ type: 'text', unique: true }) id: string;
  @Column('text') userName: string;
  @Column('text') displayName: string;
  @Column({ type: 'enum', enum: HelixUserType, default: HelixUserType.None }) type: HelixUserType;
  @Column({
    type: 'enum', enum: HelixBroadcasterType,
    default: HelixBroadcasterType.None
  }) broadcaster_type: HelixBroadcasterType;
  @Column('text') description: string;
  @Column({ type: 'text', unique: true }) profileImageUrl: string;
  @Column({ type: 'text', nullable: true }) offlineImageUrl: string;
  @Column('int') viewCount: number;
  @Column('text') email: string;

  @OneToMany('Video', 'user')
  videos: Video[];
}
