import { Injectable } from '@angular/core';
import { ClipDto } from '@twitch-audio-copyright/data';
import Clip from './clip.entity';
import { VideosService } from '../video/videos.service';
import { UsersService } from '../user/users.service';
import { ClipNotFoundError, UserNotFoundError, VideoNotFoundError } from '../errors';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';
import Video from '../video/video.entity';
import { ProcessingProgress } from '@twitch-audio-copyright/data';
import { UserActionType } from '@twitch-audio-copyright/data';

@Injectable()
export class ClipsService {

  constructor(private readonly videosService: VideosService,
              private readonly usersService: UsersService,
              @InjectRepository(Clip) private clipsRepository: Repository<Clip>) {
  }

  async insertOrUpdate(twitchClipDto: ClipDto, video: Video): Promise<Clip> {
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

  async findOne(clipId: string): Promise<Clip> {
    return await this.clipsRepository.findOne(clipId);
  }

  async updateClip(clipId: string, progress?: ProcessingProgress,
                   userActionType?: UserActionType): Promise<Clip> {
    const clip = await this.clipsRepository.findOne(clipId);
    if (!clip) {
      throw new ClipNotFoundError(`Clip ${clipId} does not exist in the database.`);
    }
    let debugMessage = `Updating clip ${clipId}`;
    if (progress) {
      debugMessage += ` From ${clip.progress} to ${progress},`
      clip.progress = progress;
    }
    if (userActionType) {
      debugMessage += ` From ${clip.userAction} to ${userActionType}.`
      clip.userAction = userActionType;
    }
    Logger.debug(debugMessage);
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


