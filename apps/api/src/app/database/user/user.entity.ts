import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import Video from '../entity/video.entity';
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

  // constructor(twitchUserDto: TwitchUser) {
  //   this.id = twitchUserDto.id;
  //   this.userName = twitchUserDto.login;
  //   this.displayName = twitchUserDto.display_name;
  //   this.type = twitchUserDto.type;
  //   this.description = twitchUserDto.description;
  //   this.profileImageUrl = twitchUserDto.profile_image_url;
  //   this.offlineImageUrl = twitchUserDto.offline_image_url;
  //   this.viewCount = twitchUserDto.view_count;
  //   this.email = twitchUserDto.email;
  // }
}
