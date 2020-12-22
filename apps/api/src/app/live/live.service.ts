import { Injectable } from '@nestjs/common';
import { AcrCloudMonitorService } from '../acr_cloud/monitor/acr-cloud-monitor.service';
import { StreamMonitorService } from '../database/stream-monitor/stream-monitor-service';
import { UsersService } from '../database/user/users.service';
import { UserCookieModel } from '../auth/model/user-cookie-model';
import { StreamMonitorEntity } from '../database/stream-monitor/stream-monitor-entity';
import UserEntity from '../database/user/user.entity';
import { MusicbrainzService } from '../musicbrainz/musicbrainz.service';
import { LiveSong, LiveSongsResults, StreamMonitor, TimeConversion } from '@twitch-audio-copyright/data';
import { TwitchService } from '../twitch/twitch.service';
import { UserNotFoundError } from '../database/errors';
import { NoActiveStreamMonitorError } from './error';

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
    const streamMonitorEntity = await this.streamMonitorDbService.insertOrUpdate(streamMonitorDto, user.id);
    return streamMonitorEntity.toStreamMonitorDto();
  }

  public async deactivateStreamMonitor(userCookie: UserCookieModel): Promise<StreamMonitor> {
    const user = await this.usersService.findOne(userCookie.id, ['streamMonitors']);
    const activeStreamMonitor = LiveService.activeStreamMonitorWithException(user, userCookie);
    await this.acrMonitorService.deleteStream(activeStreamMonitor.acrId);
    const streamMonitorEntity = await this.streamMonitorDbService.deactivate(activeStreamMonitor);
    return streamMonitorEntity.toStreamMonitorDto();
  }

  public async getStreamMonitor(userCookie: UserCookieModel): Promise<StreamMonitor> {
    const user = await this.usersService.findOne(userCookie.id, ['streamMonitors']);
    const activeStreamMonitor = LiveService.activeStreamMonitorWithException(user, userCookie);
    const acrMonitor = await this.acrMonitorService.getStream(activeStreamMonitor.acrId);
    const streamMonitorDto = activeStreamMonitor.toStreamMonitorDto();
    streamMonitorDto.state = acrMonitor.state;
    return streamMonitorDto;
  }

  public async getResults(userCookie: UserCookieModel,
                          accessToken: string,
                          date: Date): Promise<LiveSongsResults> {
    const user = await this.usersService.findOne(userCookie.id, ['streamMonitors']);
    const activeStreamMonitor = LiveService.activeStreamMonitor(user, userCookie);
    if (!activeStreamMonitor) return { hasActiveStreamMonitor: false, liveSongs: [] };
    const acrResults = await this.acrMonitorService.getResultsByDate(date, activeStreamMonitor.acrId);
    const liveSongs = acrResults.map(result => result.toLiveSongDto());
    await this.setTwitchVideoLink(liveSongs, accessToken, userCookie.id);
    return { hasActiveStreamMonitor: true, liveSongs: [] };
  }

  private async setTwitchVideoLink(liveSongs: LiveSong[], accessToken: string, userId: string): Promise<void> {
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

  // TODO: video timestamps are shifted with more than 1h (happens because Twitch saves videos with a delay)
  //  => find a solution
  private static getVideoTimestamp(videoStart: Date, timestamp: Date): string {
    const secondsDifference = (timestamp.getTime() - videoStart.getTime()) / 1000;
    return TimeConversion.secondToTwitchVodTimestamp(secondsDifference);
  }

  private static activeStreamMonitor(user: UserEntity, userCookie: UserCookieModel): StreamMonitorEntity | null {
    if (!user) {
      throw new UserNotFoundError(`Data for user ${userCookie.login} could be found in the database` +
        ` while activating the live-stream monitor.`);
    }
    if (!user.streamMonitors) {
      return null;
    }
    const activeStreamMonitor = user.streamMonitors.filter(streamMonitor => !streamMonitor.deactivatedAt)
      .find(s => s);
    if (!activeStreamMonitor) {
      return null;
    }
    return activeStreamMonitor;
  }


  private static activeStreamMonitorWithException(user: UserEntity, userCookie: UserCookieModel): StreamMonitorEntity {
    if (!user) {
      throw new UserNotFoundError(`Data for user ${userCookie.login} could be found in the database` +
        ` while activating the live-stream monitor.`);
    }
    if (!user.streamMonitors) {
      throw new NoActiveStreamMonitorError(`No stream monitors could be found for user ${userCookie.login}`);
    }
    const activeStreamMonitor = user.streamMonitors.filter(streamMonitor => !streamMonitor.deactivatedAt)
      .find(s => s);
    if (!activeStreamMonitor) {
      throw new
      NoActiveStreamMonitorError(`No active stream monitor could be found for user ${userCookie.login}`);
    }
    return activeStreamMonitor;
  }
}
