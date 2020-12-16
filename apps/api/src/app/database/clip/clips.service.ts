import { Injectable } from '@angular/core';
import { PartialClipDto, ProcessingProgress, TwitchClipDto, UserActionType } from '@twitch-audio-copyright/data';
import ClipEntity from './clip.entity';
import { VideosService } from '../video/videos.service';
import { UsersService } from '../user/users.service';
import { ClipNotFoundError, UserNotFoundError, VideoNotFoundError } from '../errors';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Logger } from '@nestjs/common';
import VideoEntity from '../video/video.entity';

@Injectable()
export class ClipsService {

  constructor(private readonly videosService: VideosService,
              private readonly usersService: UsersService,
              @InjectRepository(ClipEntity) private clipsRepository: Repository<ClipEntity>) {
  }

  async insertOrUpdate(twitchClipDto: TwitchClipDto, video: VideoEntity): Promise<ClipEntity> {
    const user = await this.usersService.findOne(twitchClipDto.broadcaster_id);
    if (!video) {
      return Promise.reject(new VideoNotFoundError(`Clip insertion faile. Video with ID ${twitchClipDto.video_id}` +
        `does not exist in the database.`));
    }
    if (!user) {
      return Promise.reject(new UserNotFoundError(`Clip insertion failed. User with ID ${twitchClipDto.broadcaster_id}` +
        `does not exist in the database.`));
    }
    const clip = ClipEntity.FromTwitchClip(twitchClipDto, video, user);
    Logger.debug(`Clip with ID '${clip.id}' was inserted.`);
    return clip.save();
  }

  async findOne(clipId: string, relations?: string[]): Promise<ClipEntity> {
    return await this.clipsRepository.findOne(clipId, {
      relations: relations
    });
  }

  async findAll(userId: string, progress?: ProcessingProgress,
                actionType?: UserActionType): Promise<ClipEntity[]> {
    const user = await this.usersService.findOne(userId, ['clips']);
    if (!user) throw new UserNotFoundError(`User ${userId} does not exist in the database.`);
    let clips = user.clips;
    if (progress) {
      clips = clips.filter(video => video.progress === progress);
    }
    if (actionType) {
      clips = clips.filter(video => video.userAction === actionType);
    }
    return clips;
  }

  async updateClip(partialClipDto: PartialClipDto): Promise<UpdateResult> {
    Logger.debug(`Clip ${partialClipDto.id} updated to ${partialClipDto}.`);
    return await this.clipsRepository.update(partialClipDto.id, partialClipDto);
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


