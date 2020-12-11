import { BaseEntity, Column, Entity, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import Video from '../video/video.entity';
import { HelixBroadcasterType, HelixUserType } from 'twitch';
import { TwitchUserDto } from '@twitch-audio-copyright/data';
import Clip from '../clip/clip.entity';
import { StreamMonitor } from '../stream-monitor/stream-monitor-entity';

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
  @OneToOne(() => StreamMonitor, streamMonitor => streamMonitor.user)
  streamMonitor: StreamMonitor;

  @OneToMany('Clip', 'user')
  clips: Clip[];

  static FromTwitchUser(userDto: TwitchUserDto): User {
    const user = new User();
    user.id = userDto.id;
    user.userName = userDto.login;
    user.displayName = userDto.display_name;
    user.type = userDto.type;
    user.description = userDto.description;
    user.profileImageUrl = userDto.profile_image_url;
    user.offlineImageUrl = userDto.offline_image_url;
    user.viewCount = userDto.view_count;
    user.email = userDto.email;
    return user;
  }
}
