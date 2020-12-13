import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AcrCloudMonitorService } from '../acr_cloud/monitor/acr-cloud-monitor.service';
import { StreamMonitorService } from '../database/stream-monitor/stream-monitor-service';
import { UsersService } from '../database/user/users.service';
import { UserCookieModel } from '../auth/model/user-cookie-model';
import { StreamMonitor } from '../database/stream-monitor/stream-monitor-entity';
import { StreamMonitorDto } from '../acr_cloud/model/stream-monitor-dto';
import User from '../database/user/user.entity';
import { MusicbrainzService } from '../musicbrainz/musicbrainz.service';
import { LiveSongDto } from '@twitch-audio-copyright/data';
import { TwitchService } from '../twitch/twitch.service';


@Injectable()
export class LiveService {

  private static TwitchBaseUrl = 'https://www.twitch.tv/';

  constructor(private readonly acrMonitorService: AcrCloudMonitorService,
              private readonly streamMonitorDbService: StreamMonitorService,
              private readonly usersService: UsersService,
              private readonly musicBrainzService: MusicbrainzService,
              private readonly twitchService: TwitchService) {
  }

  async addMonitor(user: UserCookieModel, isRealTime: boolean, isRecorded: boolean): Promise<StreamMonitor> {
    const baseUrl = LiveService.TwitchBaseUrl;
    const streamMonitorDto = await
      this.acrMonitorService.addStream(`${baseUrl}${user.login}`, user.login, isRealTime, isRecorded);
    return this.streamMonitorDbService.insertOrUpdate(streamMonitorDto, user.id);
  }

  public async deactivateStreamMonitor(userCookie: UserCookieModel): Promise<StreamMonitor> {
    const user = await this.usersService.findOne(userCookie.id, ['streamMonitors']);
    const activeStreamMonitor = LiveService.activeStreamMonitor(user);
    await this.acrMonitorService.deleteStream(activeStreamMonitor.acrId);
    return this.streamMonitorDbService.deactivate(activeStreamMonitor);
  }


  public async getStreamMonitor(userCookie: UserCookieModel): Promise<StreamMonitorDto> {
    const user = await this.usersService.findOne(userCookie.id, ['streamMonitors']);
    const activeStreamMonitor = LiveService.activeStreamMonitor(user);
    return this.acrMonitorService.getStream(activeStreamMonitor.acrId);
  }

  public async getResults(userCookie: UserCookieModel,
                          accessToken: string,
                          date: Date): Promise<unknown> {
    const user = await this.usersService.findOne(userCookie.id, ['streamMonitors']);
    const activeStreamMonitor = LiveService.activeStreamMonitor(user);
    const acrResults = await this.acrMonitorService.getResultsByDate(date, activeStreamMonitor.acrId);
    const liveSongs = acrResults.map(result => result.toLiveSongDto());
    await this.setTwitchVideoLink(liveSongs, accessToken, userCookie.id);
    return liveSongs;
  }

  private async setTwitchVideoLink(liveSongs: LiveSongDto[], accessToken: string, userId: string): Promise<void> {
    const videos = await this.twitchService.getAllVideos(accessToken, userId);
    liveSongs.forEach(liveSong => {
      videos.forEach(video => {
        const videoEnd = new Date(video.publishDate.getTime() + video.durationInSeconds * 1000);
        if (liveSong.identifiedAt >= video.publishDate && liveSong.identifiedAt <= videoEnd) {
          liveSong.twitchVideoUrl = video.url +
            `?t=${LiveService.getVideoTimestamp(video.creationDate, liveSong.identifiedAt)}`;
        }
      });
    });
  }

  private static getVideoTimestamp(videoStart: Date, timestamp: Date): string {
    const secondsDifference = (timestamp.getTime() - videoStart.getTime()) / 1000;
    const hours = Math.floor(secondsDifference / 3600);
    const minutes = Math.floor(secondsDifference % 3600 / 60);
    const seconds = Math.floor(secondsDifference % 3600 % 60);
    const hoursString = hours > 0 ? hours.toString() + 'h' : '';
    const minutesString = minutes > 0 ? minutes.toString() + 'm' : '';
    const secondsString = seconds > 0 ? seconds.toString() + 's' : '';
    return hoursString + minutesString + secondsString;
  }

  private static activeStreamMonitor(user: User): StreamMonitor {
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
