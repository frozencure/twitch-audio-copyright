import { StreamMonitor } from './stream-monitor-entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StreamMonitorDto } from '../../acr_cloud/model/stream-monitor-dto';
import { UsersService } from '../user/users.service';
import { UserNotFoundError } from '../errors';

@Injectable()
export class StreamMonitorService {

  constructor(@InjectRepository(StreamMonitor) private streamMonitorService: Repository<StreamMonitor>,
              private userService: UsersService) {
  }

  async insertOrUpdate(streamMonitorDto: StreamMonitorDto, userId: string): Promise<StreamMonitor> {
    const user = await this.userService.findOne(userId);
    if (user) {
      const streamMonitor = StreamMonitor.FromStreamMonitorDto(streamMonitorDto);
      Logger.debug(`Saving/Updating stream monitor with ID ${streamMonitorDto.id} to database.`);
      streamMonitor.user = user;
      return streamMonitor.save();
    } else {
      throw new UserNotFoundError(`User ${userId} does not exist in the database.`);
    }
  }

  async findOne(streamId: string): Promise<StreamMonitor> {
    return await this.streamMonitorService.findOne(streamId);
  }

}
