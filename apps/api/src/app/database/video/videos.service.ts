import { Injectable } from '@angular/core';
import { HelixVideo } from 'twitch';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@nestjs/common';
import { UsersService } from '../user/users.service';
import Video from './video.entity';
import { ProcessingProgress } from '../processing-progress';

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

  async updateVideoProgress(videoId: number, progress: ProcessingProgress): Promise<Video> {
    const video = await this.videosRepository.findOne(videoId);
    if (video) {
      try {
        video.progress = progress;
        Logger.debug(`Updating progress for video ${videoId} to ${progress}`);
        return await video.save();
      } catch (e) {
        return Promise.reject(e);
      }
    } else {
      return Promise.reject(`Video with ID ${videoId} does not exist.`);
    }
  }

  async findOne(videoId: number): Promise<Video> {
    return await this.videosRepository.findOne(videoId);
  }
}
