import { BaseEntity, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import VideoEntity from '../video/video.entity';
import { HelixBroadcasterType, HelixUserType } from 'twitch';
import { TwitchUserDto } from '@twitch-audio-copyright/data';
import ClipEntity from '../clip/clip.entity';
import { StreamMonitorEntity } from '../stream-monitor/stream-monitor-entity';

@Entity('user')
export default class UserEntity extends BaseEntity {

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

  @OneToMany(() => VideoEntity, video => video.user)
  videos: VideoEntity[];

  @OneToMany(() => StreamMonitorEntity, streamMonitor => streamMonitor.user)
  streamMonitors: StreamMonitorEntity[];

  @OneToMany(() => ClipEntity, clip => clip.user)
  clips: ClipEntity[];

  static FromTwitchUser(userDto: TwitchUserDto): UserEntity {
    const user = new UserEntity();
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
