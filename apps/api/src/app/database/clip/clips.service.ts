import { Injectable } from '@angular/core';
import { ClipDto } from '@twitch-audio-copyright/data';
import Clip from './clip.entity';
import { VideosService } from '../video/videos.service';
import { UsersService } from '../user/users.service';
import { UserNotFoundError, VideoNotFoundError } from '../errors';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';
import Video from '../video/video.entity';
import { ProcessingProgress } from '../processing-progress';


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

  async updateProgress(clipId: string, progress: ProcessingProgress): Promise<Clip> {
    const clip = await this.clipsRepository.findOne(clipId);
    if (clip) {
      try {
        clip.progress = progress;
        Logger.debug(`Updating progress for clip ${clipId} to ${progress}`);
        return await clip.save();
      } catch (e) {
        return Promise.reject(e);
      }
    } else {
      return Promise.reject(`Could not update progress. Clip with ID ${clip} does not exist.`);
    }
  }


}


