import { Injectable } from '@angular/core';
import { PartialClipDto, ProcessingProgress, TwitchClipDto, UserActionType } from '@twitch-audio-copyright/data';
import ClipEntity from './clip.entity';
import { VideosService } from '../video/videos.service';
import { UsersService } from '../user/users.service';
import { ClipNotFoundError, UserNotFoundError } from '../errors';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Logger } from '@nestjs/common';

@Injectable()
export class ClipsService {

  constructor(private readonly videosService: VideosService,
              private readonly usersService: UsersService,
              @InjectRepository(ClipEntity) private clipsRepository: Repository<ClipEntity>) {
  }

  async insertOrUpdate(twitchClip: TwitchClipDto): Promise<ClipEntity> {
    const user = await this.usersService.findOne(twitchClip.broadcaster_id);
    if (!user) {
      return Promise.reject(new UserNotFoundError(`Clip insertion failed. User with ID ${twitchClip.broadcaster_id}` +
        `does not exist in the database.`));
    }
    const clip = ClipEntity.FromTwitchClip(twitchClip, user);
    Logger.debug(`Clip with ID '${clip.id}' was inserted.`);
    return clip.save();
  }

  async findOne(clipId: string, relations?: string[]): Promise<ClipEntity> {
    return await this.clipsRepository.findOne(clipId, {
      relations: relations
    });
  }

  async findAll(withSongs = false, userId: string, progress?: ProcessingProgress,
                actionType?: UserActionType): Promise<ClipEntity[]> {
    let user;
    if(withSongs) {
      user = await this.usersService.findOne(userId,
        ['clips', 'clips.identifiedSongs',
          'clips.identifiedSongs.label', 'clips.identifiedSongs.album',
          'clips.identifiedSongs.artists', 'clips.identifiedSongs.label.metadata']);
    } else {
      user = await this.usersService.findOne(userId, ['clips']);
    }
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


