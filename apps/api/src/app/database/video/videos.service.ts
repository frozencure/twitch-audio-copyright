import { Injectable } from '@angular/core';
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@nestjs/common';
import { UsersService } from '../user/users.service';
import VideoEntity from './video.entity';
import { PartialVideoDto, ProcessingProgress, TwitchVideoDto, UserActionType } from '@twitch-audio-copyright/data';
import { UserNotFoundError, VideoNotFoundError } from '../errors';

@Injectable()
export class VideosService {

  constructor(private readonly usersService: UsersService,
              @InjectRepository(VideoEntity) private readonly videosRepository: Repository<VideoEntity>) {
  }

  async insertOrUpdate(userId: string, twitchVideo: TwitchVideoDto): Promise<VideoEntity> {
    const user = await this.usersService.findOne(userId);
    if (user) {
      const video = VideoEntity.FromTwitchVideo(twitchVideo, user);
      Logger.debug(`Saving/Updating video with ID ${video.id} to database.`);
      return await video.save();
    } else {
      throw new UserNotFoundError(`User ${userId} could not be found while inserting video ${twitchVideo.id}.`);
    }
  }

  async insertIfNotFound(userId: string, twitchVideo: TwitchVideoDto): Promise<VideoEntity> {
    const video = await this.findOne(twitchVideo.id);
    if (!video) {
      return await this.insertOrUpdate(userId, twitchVideo);
    }
    return video;
  }

  async updateVideo(videoDto: PartialVideoDto): Promise<UpdateResult> {
    Logger.debug(`Updating video ${videoDto.id} to ${videoDto}`);
    return await this.videosRepository.update(videoDto.id, videoDto);
  }

  async findOne(videoId: number, relations?: string[]): Promise<VideoEntity> {
    return await this.videosRepository.findOne(videoId,
      { relations: relations });
  }

  async findAll(userId: string, progress?: ProcessingProgress,
                actionType?: UserActionType): Promise<VideoEntity[]> {
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
