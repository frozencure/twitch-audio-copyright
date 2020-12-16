import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { TokenGuard } from '../auth/token-guard.service';
import { User } from '../utils/decorators';
import { UserCookieModel } from '../auth/model/user-cookie-model';
import { Clip, IdentifiedSong, PartialClipDto, ProcessingProgress, UserActionType } from '@twitch-audio-copyright/data';
import { ClipsService } from '../database/clip/clips.service';
import { UpdateResult } from 'typeorm';

@Controller('/clips')
export class ClipController {

  constructor(private readonly clipsService: ClipsService) {
  }

  @Get()
  @UseGuards(TokenGuard)
  public async getClips(@User() user: UserCookieModel,
                        @Query('progress') progress?: ProcessingProgress,
                        @Query('action') action?: UserActionType): Promise<Clip[]> {
    return await this.clipsService.findAll(user.id, progress, action);
  }

  @Patch(':id')
  @UseGuards(TokenGuard)
  public async update(@Body() updateModel: PartialClipDto,
                      @Param('id') clipId: string): Promise<UpdateResult> {
    updateModel.id = clipId;
    return await this.clipsService.updateClip(updateModel);
  }

  @Get(':id/songs')
  @UseGuards(TokenGuard)
  public async getIdentifiedSongs(@Param('id') clipId: string): Promise<IdentifiedSong[]> {
    const clip = await this.clipsService.findOne(clipId, ['identifiedSongs', 'label', 'identifiedSongs.label']);
    return clip.identifiedSongs.map(song => song.toIdentifiedSongDto());
  }

  @Get(':id')
  @UseGuards(TokenGuard)
  public async getClip(@Param('id') clipId: string): Promise<Clip> {
    return await this.clipsService.findOne(clipId);
  }
}
