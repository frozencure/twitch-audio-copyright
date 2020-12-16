import { StreamMonitorEntity } from './stream-monitor-entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AcrCloudStreamMonitorDto } from '../../acr_cloud/model/acr-cloud-stream-monitor-dto';
import { UsersService } from '../user/users.service';
import { UserNotFoundError } from '../errors';
import { Repository } from 'typeorm';

@Injectable()
export class StreamMonitorService {

  constructor(@InjectRepository(StreamMonitorEntity) private streamMonitorService: Repository<StreamMonitorEntity>,
              private userService: UsersService) {
  }

  async insertOrUpdate(streamMonitorDto: AcrCloudStreamMonitorDto, userId: string): Promise<StreamMonitorEntity> {
    const user = await this.userService.findOne(userId);
    if (user) {
      const streamMonitor = StreamMonitorEntity.FromAcrCloudMonitorDto(streamMonitorDto);
      Logger.debug(`Saving/Updating stream monitor with ID ${streamMonitorDto.id} to database.`);
      streamMonitor.user = user;
      return streamMonitor.save();
    } else {
      throw new UserNotFoundError(`User ${userId} does not exist in the database.`);
    }
  }

  async deactivate(stream: StreamMonitorEntity): Promise<StreamMonitorEntity> {
    if (!stream.deactivatedAt) {
      stream.deactivatedAt = new Date();
    }
    return stream.save();
  }

  async findOne(streamId: string): Promise<StreamMonitorEntity> {
    return await this.streamMonitorService.findOne(streamId);
  }

}
