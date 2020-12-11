import { Injectable } from '@angular/core';
import { HelixVideo } from 'twitch';
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@nestjs/common';
import { UsersService } from '../user/users.service';
import Video from './video.entity';
import { PartialVideoDto, ProcessingProgress, UserActionType } from '@twitch-audio-copyright/data';
import { UserNotFoundError, VideoNotFoundError } from '../errors';

@Injectable()
export class VideosService {

  constructor(private readonly usersService: UsersService,
              @InjectRepository(Video) private readonly videosRepository: Repository<Video>) {
  }

  async insertOrUpdate(userId: string, twitchVideo: HelixVideo): Promise<Video> {
    const user = await this.usersService.findOne(userId);
    if (user) {
      try {
        const video = Video.FromTwitchVideo(twitchVideo, user);
        Logger.debug(`Saving/Updating video with ID ${video.id} to database.`);
        return await video.save();
      } catch (e) {
        return Promise.reject(e);
      }
    } else {
      return Promise.reject('User does not exist.');
    }
  }

  async insertIfNotFound(userId: string, twitchVideo: HelixVideo): Promise<Video> {
    const video = await this.findOne(Number.parseInt(twitchVideo.id));
    if (!video) {
      return await this.insertOrUpdate(userId, twitchVideo);
    }
    return video;
  }

  async updateVideo(videoDto: PartialVideoDto): Promise<UpdateResult> {
    Logger.debug(`Updating video ${videoDto.id} to ${videoDto}`);
    return await this.videosRepository.update(videoDto.id, videoDto);
  }

  async findOne(videoId: number, relations?: string[]): Promise<Video> {
    return await this.videosRepository.findOne(videoId,
      { relations: relations });
  }

  async findAll(userId: string, progress?: ProcessingProgress,
                actionType?: UserActionType): Promise<Video[]> {
    const user = await this.usersService.findOne(userId, ['videos']);
    if (!user) throw new UserNotFoundError(`User ${userId} does not exist in the database.`);
    let videos = user.videos;
    if (progress) {
      videos = videos.filter(video => video.progress === progress);
    }
    if (actionType) {
      videos = videos.filter(video => video.userAction === actionType);
    }
    return videos;
  }

  async hasIdentifiedSongs(videoId: number): Promise<boolean> {
    const video = await this.videosRepository.findOne(videoId,
      { relations: ['identifiedSongs'] });
    if (!video) {
      throw new VideoNotFoundError(`Video ${videoId} does not exist in the database.`);
    }
    return !!(video.identifiedSongs && video.identifiedSongs.length);
  }
}
