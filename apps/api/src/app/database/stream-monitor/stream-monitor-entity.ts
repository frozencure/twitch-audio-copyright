import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import UserEntity from '../user/user.entity';
import { AcrCloudStreamMonitorDto } from '../../acr_cloud/model/acr-cloud-stream-monitor-dto';
import { StreamMonitor } from '@twitch-audio-copyright/data';

@Entity('stream_monitor')
export class StreamMonitorEntity extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column('text') acrId: string;
  @Column('text') url: string;
  @Column('text') name: string;
  @Column('boolean') isRealTime: boolean;
  @Column('boolean') isRecorded: boolean;

  @Column('timestamp') activatedAt: Date;
  @Column({ type: 'timestamp', nullable: true }) deactivatedAt?: Date;

  @ManyToOne(() => UserEntity, user => user.streamMonitors)
  user: UserEntity;

  static FromAcrCloudMonitorDto(streamMonitorDto: AcrCloudStreamMonitorDto): StreamMonitorEntity {
    const streamMonitor = new StreamMonitorEntity();
    streamMonitor.acrId = streamMonitorDto.id;
    streamMonitor.name = streamMonitorDto.stream_name;
    streamMonitor.url = streamMonitorDto.url;
    streamMonitor.isRealTime = streamMonitorDto.realtime;
    streamMonitor.isRecorded = streamMonitorDto.record !== '0';
    streamMonitor.activatedAt = new Date();
    return streamMonitor;
  }

  toStreamMonitorDto(): StreamMonitor {
    return Object.assign(new StreamMonitor(), this, {user: undefined});
  }
}
