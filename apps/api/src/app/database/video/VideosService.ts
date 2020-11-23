import { Injectable } from '@angular/core';
import Video, { VideoProgress, VideoType } from './video.entity';
import { HelixVideo } from 'twitch';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@nestjs/common';
import { UsersService } from '../user/users.service';

@Injectable()
export class VideosService {

  constructor(private readonly usersService: UsersService,
              @InjectRepository(Video) private readonly videosRepository: Repository<Video>) {
  }

  async insertOrUpdate(userId: string, twitchVideo: HelixVideo): Promise<Video> {
    const user = await this.usersService.findOne(userId);
    if (user) {
      try {
        const video = new Video();
        console.log(video);
        video.id = Number.parseInt(twitchVideo.id);
        video.title = twitchVideo.title;
        video.description = twitchVideo.description;
        video.type = VideoType[twitchVideo.type.toString()];
        video.url = twitchVideo.url;
        video.views = twitchVideo.views;
        video.isPublic = twitchVideo.isPublic;
        video.durationInSeconds = twitchVideo.durationInSeconds;
        video.language = twitchVideo.language;
        video.createdAt = twitchVideo.creationDate;
        video.publishedAt = twitchVideo.publishDate;
        video.user = user;
        video.progress = VideoProgress.QUEUED;
        console.log(video);
        return await video.save();
      } catch (e) {
        Logger.error(e);
        return Promise.reject(e);
      }
    } else {
      return Promise.reject('User does not exist.');
    }
  }


  async updateVideoProgress(videoId: number, progress: VideoProgress): Promise<Video> {
    const video = await this.videosRepository.findOne(videoId);
    if (video) {
      try {
        video.progress = progress;
        return await video.save();
      } catch (e) {
        return Promise.reject(e);
      }
    } else {
      return Promise.reject(`Video with ID ${videoId} does not exist.`);
    }
  }
}
