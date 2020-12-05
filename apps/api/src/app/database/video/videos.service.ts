import { Injectable } from '@angular/core';
import { HelixVideo } from 'twitch';
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@nestjs/common';
import { UsersService } from '../user/users.service';
import Video from './video.entity';
import { ProcessingProgress, UserActionType, PartialVideoDto } from '@twitch-audio-copyright/data';
import { VideoNotFoundError } from '../errors';

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
    let query = this.videosRepository.createQueryBuilder('video')
      .leftJoin('video.user', 'user')
      .where('user.id = :id', { id: userId });
    if (progress) {
      query = query.andWhere('video.progress = :progress',
        { progress: progress });
    }
    if (actionType) {
      query = query.andWhere('video.userAction = :userAction',
        { userAction: actionType });
    }
    return await query.execute() as Promise<Video[]>;
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
