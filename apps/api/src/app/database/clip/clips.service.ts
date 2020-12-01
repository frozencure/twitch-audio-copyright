import { Injectable } from '@angular/core';
import { PartialClipDto, ProcessingProgress, TwitchClipDto, UserActionType } from '@twitch-audio-copyright/data';
import Clip from './clip.entity';
import { VideosService } from '../video/videos.service';
import { UsersService } from '../user/users.service';
import { ClipNotFoundError, UserNotFoundError, VideoNotFoundError } from '../errors';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';
import Video from '../video/video.entity';

@Injectable()
export class ClipsService {

  constructor(private readonly videosService: VideosService,
              private readonly usersService: UsersService,
              @InjectRepository(Clip) private clipsRepository: Repository<Clip>) {
  }

  async insertOrUpdate(twitchClipDto: TwitchClipDto, video: Video): Promise<Clip> {
    const user = await this.usersService.findOne(twitchClipDto.broadcaster_id);
    if (!video) {
      return Promise.reject(new VideoNotFoundError(`Clip insertion faile. Video with ID ${twitchClipDto.video_id}` +
        `does not exist in the database.`));
    }
    if (!user) {
      return Promise.reject(new UserNotFoundError(`Clip insertion failed. User with ID ${twitchClipDto.broadcaster_id}` +
        `does not exist in the database.`));
    }
    const clip = Clip.FromTwitchClip(twitchClipDto, video, user);
    Logger.debug(`Clip with ID '${clip.id}' was inserted.`);
    return clip.save();
  }

  async findOne(clipId: string, relations?: string[]): Promise<Clip> {
    return await this.clipsRepository.findOne(clipId, {
      relations: relations
    });
  }

  async findAll(userId: string, progress?: ProcessingProgress,
                actionType?: UserActionType): Promise<Clip[]> {
    let query = this.clipsRepository.createQueryBuilder('clip')
      .leftJoin('clip.user', 'user')
      .where('user.id = :id', { id: userId });
    if (progress) {
      query = query.andWhere('clip.progress = :progress',
        { progress: progress });
    }
    if (actionType) {
      query = query.andWhere('clip.userAction = :userAction',
        { userAction: actionType });
    }
    return await query.execute() as Promise<Clip[]>;
  }

  async updateClip(partialClipDto: PartialClipDto): Promise<Clip> {
    let clip = await this.clipsRepository.findOne(partialClipDto.id);
    clip = Object.assign(clip, partialClipDto);
    if (!clip) {
      throw new ClipNotFoundError(`Clip ${partialClipDto.id} does not exist in the database.`);
    }
    Logger.debug(`Clip ${clip.id} updated to ${partialClipDto}.`);
    return await clip.save();
  }

  async hasIdentifiedSongs(clipId: string): Promise<boolean> {
    const clip = await this.clipsRepository.findOne(clipId, {
      relations: ['identifiedSongs']
    });
    if (!clip) {
      throw new ClipNotFoundError(`Clip ${clipId} does not exist in the database.`);
    }
    return !!(clip.identifiedSongs && clip.identifiedSongs.length);
  }
}


