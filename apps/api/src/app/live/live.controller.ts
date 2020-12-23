import { Controller, Get, Logger, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { Token, User } from '../utils/decorators';
import { UserCookieModel } from '../auth/model/user-cookie-model';
import { TokenGuard } from '../auth/token-guard.service';
import { LiveService } from './live.service';
import { LiveSong, LiveSongsResults, StreamMonitor } from '@twitch-audio-copyright/data';
import { ParseDatePipe } from './parse-date-pipe';
import { AcrStatusResponseError } from '../acr_cloud/model/errors';
import { AcrCloudHttpError, NoActiveMonitorHttpError, NoUserDatabaseHttpError, UnknownHttpError } from '../errors';
import { UserNotFoundError } from '../database/errors';
import { NoActiveStreamMonitorError } from './error';

@Controller('live/')
export class LiveController {

  constructor(private liveService: LiveService) {
  }

  @Post('activate')
  @UseGuards(TokenGuard)
  public async addMonitor(@User() user: UserCookieModel,
                    @Query('realtime') isRealTime = false,
                    @Query('record') isRecorded = false): Promise<StreamMonitor> {
    try {
      return await this.liveService.addMonitor(user, isRealTime, isRecorded);
    } catch (e) {
      Logger.error(e);
      if (e instanceof AcrStatusResponseError) {
        throw new AcrCloudHttpError(e.message);
      } else if (e instanceof UserNotFoundError) {
        throw new NoUserDatabaseHttpError(e.message);
      } else {
        throw new UnknownHttpError(e.message);
      }
    }
  }

  @Patch('deactivate')
  @UseGuards(TokenGuard)
  public async deactivateStreamMonitor(@User() userCookie: UserCookieModel): Promise<StreamMonitor> {
    try {
      return await this.liveService.deactivateStreamMonitor(userCookie);
    } catch (e) {
      LiveController.handleErrors(e);
    }
  }

  @Get()
  @UseGuards(TokenGuard)
  public async getStreamMonitor(@User() userCookie: UserCookieModel): Promise<StreamMonitor | undefined> {
    try {
      return await this.liveService.getStreamMonitor(userCookie);
    } catch (e) {
      LiveController.handleErrors(e);
    }

  }

  @Get('results')
  @UseGuards(TokenGuard)
  public async getResults(@User() userCookie: UserCookieModel,
                          @Token() token: string,
                          @Query('date', new ParseDatePipe()) date: Date): Promise<LiveSongsResults> {
    try {
      return await this.liveService.getResults(userCookie, token, date);
    } catch (e) {
      LiveController.handleErrors(e);
    }

  }

  private static handleErrors(e: Error): void {
    if (e instanceof UserNotFoundError) {
      Logger.error(e);
      throw new NoUserDatabaseHttpError(e.message);
    } else if (e instanceof NoActiveStreamMonitorError) {
      throw new NoActiveMonitorHttpError(e.message);
    } else if (e instanceof AcrStatusResponseError) {
      Logger.error(e);
      throw new AcrCloudHttpError(e.message);
    } else {
      Logger.error(e);
      throw new UnknownHttpError(e.message);
    }
  }

}
