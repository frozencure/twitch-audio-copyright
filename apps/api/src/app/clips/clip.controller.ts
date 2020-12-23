import { Body, Controller, Get, Logger, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { TokenGuard } from '../auth/token-guard.service';
import { User } from '../utils/decorators';
import { UserCookieModel } from '../auth/model/user-cookie-model';
import { Clip, IdentifiedSong, PartialClipDto, ProcessingProgress, UserActionType } from '@twitch-audio-copyright/data';
import { ClipsService } from '../database/clip/clips.service';
import { UpdateResult } from 'typeorm';
import { UserNotFoundError } from '../database/errors';
import { NoUserDatabaseHttpError, UnknownDatabaseHttpError, UnknownHttpError } from '../errors';

@Controller('/clips')
export class ClipController {

  constructor(private readonly clipsService: ClipsService) {
  }

  @Get()
  @UseGuards(TokenGuard)
  public async getClips(@User() user: UserCookieModel,
                        @Query('progress') progress?: ProcessingProgress,
                        @Query('action') action?: UserActionType): Promise<Clip[]> {
    try {
      return await this.clipsService.findAll(user.id, progress, action);
    } catch (e) {
      Logger.error(e);
      if (e instanceof UserNotFoundError) {
        throw new NoUserDatabaseHttpError(e.message);
      } else {
        throw new UnknownHttpError(e.message);
      }
    }
  }

  @Patch(':id')
  @UseGuards(TokenGuard)
  public async update(@Body() updateModel: PartialClipDto,
                      @Param('id') clipId: string): Promise<UpdateResult> {
    updateModel.id = clipId;
    try {
      return await this.clipsService.updateClip(updateModel);
    } catch (e) {
      Logger.error(e);
      throw new UnknownDatabaseHttpError(e.message);
    }
  }

  @Get(':id/songs')
  @UseGuards(TokenGuard)
  public async getIdentifiedSongs(@Param('id') clipId: string): Promise<IdentifiedSong[]> {
    try {
      const clip = await this.clipsService.findOne(clipId, ['identifiedSongs', 'label', 'identifiedSongs.label']);
      return clip.identifiedSongs.map(song => song.toIdentifiedSongDto());
    } catch (e) {
      Logger.error(e);
      throw new UnknownDatabaseHttpError(e.message);
    }
  }

  @Get(':id')
  @UseGuards(TokenGuard)
  public async getClip(@Param('id') clipId: string): Promise<Clip> {
    try {
      return await this.clipsService.findOne(clipId);
    } catch (e) {
      Logger.error(e);
      throw new UnknownDatabaseHttpError(e.message);
    }
  }
}
