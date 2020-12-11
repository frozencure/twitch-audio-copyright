import { BaseEntity, Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import User from '../user/user.entity';
import { StreamMonitorDto } from '../../acr_cloud/model/stream-monitor-dto';

@Entity('stream_monitor')
export class StreamMonitor extends BaseEntity {
  @PrimaryColumn('text') acrId: string;
  @Column('text') url: string;
  @Column('text') name: string;
  @Column('boolean') isRealTime: boolean;
  @Column('boolean') isRecorded: boolean;

  @Column('timestamp') activatedAt: Date;

  @OneToOne(() => User, user => user.streamMonitor)
  user: User;

  static FromStreamMonitorDto(streamMonitorDto: StreamMonitorDto): StreamMonitor {
    const streamMonitor = new StreamMonitor();
    streamMonitor.acrId = streamMonitorDto.id;
    streamMonitor.name = streamMonitorDto.stream_name;
    streamMonitor.url = streamMonitorDto.url;
    streamMonitor.isRealTime = streamMonitorDto.realtime
    streamMonitor.isRecorded = streamMonitorDto.record !== '0'
    streamMonitor.activatedAt = new Date();
    return streamMonitor;
  }
}
