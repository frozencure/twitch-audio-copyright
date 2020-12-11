import { Controller, Get, HttpException, HttpStatus, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { User } from '../utils/decorators';
import { User as UserEntity } from '../database/user/user.entity';
import { UserCookieModel } from '../auth/model/user-cookie-model';
import { TokenGuard } from '../auth/token-guard.service';
import { AcrCloudMonitorService } from '../acr_cloud/monitor/acr-cloud-monitor.service';
import { StreamMonitorService } from '../database/stream-monitor/stream-monitor-service';
import { StreamMonitor } from '../database/stream-monitor/stream-monitor-entity';
import { StreamMonitorDto } from '../acr_cloud/model/stream-monitor-dto';
import { UsersService } from '../database/user/users.service';

@Controller('live/')
export class LiveController {

  constructor(private readonly acrMonitorService: AcrCloudMonitorService,
              private readonly streamMonitorDbService: StreamMonitorService,
              private readonly usersService: UsersService) {
  }

  @Post('activate')
  @UseGuards(TokenGuard)
  public async addMonitor(@User() user: UserCookieModel,
                          @Query('realtime') isRealTime = false,
                          @Query('record') isRecorded = false): Promise<StreamMonitor> {
    const baseUrl = 'https://www.twitch.tv/';
    const streamMonitorDto = await
      this.acrMonitorService.addStream(`${baseUrl}${user.login}`, user.login, isRealTime, isRecorded);
    return this.streamMonitorDbService.insertOrUpdate(streamMonitorDto, user.id);
  }

  @Patch('deactivate')
  @UseGuards(TokenGuard)
  public async deactivateStreamMonitor(@User() userCookie: UserCookieModel): Promise<StreamMonitor> {
    const user = await this.usersService.findOne(userCookie.id, ['streamMonitors']);
    const activeStreamMonitor = LiveController.activeStreamMonitor(user);
    await this.acrMonitorService.deleteStream(activeStreamMonitor.acrId);
    return this.streamMonitorDbService.deactivate(activeStreamMonitor);
  }

  @Get()
  @UseGuards(TokenGuard)
  public async getStreamMonitor(@User() userCookie: UserCookieModel): Promise<StreamMonitorDto> {
    const user = await this.usersService.findOne(userCookie.id, ['streamMonitors']);
    const activeStreamMonitor = LiveController.activeStreamMonitor(user);
    return this.acrMonitorService.getStream(activeStreamMonitor.acrId);
  }

  private static activeStreamMonitor(user: UserEntity): StreamMonitor {
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (!user.streamMonitors) {
      throw new HttpException('No active stream monitor found',
        HttpStatus.NOT_FOUND);
    }
    const activeStreamMonitor = user.streamMonitors.filter(streamMonitor => !streamMonitor.deactivatedAt)
      .find(s => s);
    if (!activeStreamMonitor) {
      throw new HttpException('No active stream monitor found',
        HttpStatus.NOT_FOUND);
    }
    return activeStreamMonitor;
  }

}
