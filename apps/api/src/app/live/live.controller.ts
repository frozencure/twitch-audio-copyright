import { Controller, Get, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { Token, User } from '../utils/decorators';
import { UserCookieModel } from '../auth/model/user-cookie-model';
import { TokenGuard } from '../auth/token-guard.service';
import { StreamMonitor } from '../database/stream-monitor/stream-monitor-entity';
import { StreamMonitorDto } from '../acr_cloud/model/stream-monitor-dto';
import { LiveService } from './live.service';

@Controller('live/')
export class LiveController {

  constructor(private liveService: LiveService) {
  }

  @Post('activate')
  @UseGuards(TokenGuard)
  public addMonitor(@User() user: UserCookieModel,
                    @Query('realtime') isRealTime = false,
                    @Query('record') isRecorded = false): Promise<StreamMonitor> {
    return this.liveService.addMonitor(user, isRealTime, isRecorded);
  }

  @Patch('deactivate')
  @UseGuards(TokenGuard)
  public deactivateStreamMonitor(@User() userCookie: UserCookieModel): Promise<StreamMonitor> {
    return this.liveService.deactivateStreamMonitor(userCookie);
  }

  @Get()
  @UseGuards(TokenGuard)
  public async getStreamMonitor(@User() userCookie: UserCookieModel): Promise<StreamMonitorDto> {
    return this.liveService.getStreamMonitor(userCookie);
  }

  @Get('results')
  @UseGuards(TokenGuard)
  public async getResults(@User() userCookie: UserCookieModel,
                          @Token() token: string): Promise<unknown> {
    return this.liveService.getResults(userCookie, token, new Date());
  }

}
