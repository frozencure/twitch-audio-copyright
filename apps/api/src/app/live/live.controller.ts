import { Controller, Get, Patch, Post, Query, Type, UseGuards } from '@nestjs/common';
import { Token, User } from '../utils/decorators';
import { UserCookieModel } from '../auth/model/user-cookie-model';
import { TokenGuard } from '../auth/token-guard.service';
import { StreamMonitorEntity } from '../database/stream-monitor/stream-monitor-entity';
import { LiveService } from './live.service';
import { LiveSong, StreamMonitor } from '@twitch-audio-copyright/data';
import { ParseDatePipe } from './parse-date-pipe';

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
  public getStreamMonitor(@User() userCookie: UserCookieModel): Promise<StreamMonitor> {
    return this.liveService.getStreamMonitor(userCookie);

  }

  @Get('results')
  @UseGuards(TokenGuard)
  public async getResults(@User() userCookie: UserCookieModel,
                          @Token() token: string,
                          @Query('date', new ParseDatePipe()) date: Date): Promise<LiveSong[]> {
    return this.liveService.getResults(userCookie, token, date);
  }

}
