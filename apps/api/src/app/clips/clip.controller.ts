import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { TokenGuard } from '../auth/token-guard.service';
import { User } from '../utils/decorators';
import { UserCookieModel } from '../auth/model/user-cookie-model';
import { ClipDto, PartialClipDto, ProcessingProgress, UserActionType } from '@twitch-audio-copyright/data';
import IdentifiedSong from '../database/identified-song/identified-song.entity';
import { ClipsService } from '../database/clip/clips.service';

@Controller('/clips')
export class ClipController {

  constructor(private readonly clipsService: ClipsService) {
  }

  @Get()
  @UseGuards(TokenGuard)
  public async getClips(@User() user: UserCookieModel,
                        @Query('progress') progress?: ProcessingProgress,
                        @Query('action') action?: UserActionType): Promise<ClipDto[]> {
    return await this.clipsService.findAll(user.id, progress, action);
  }

  @Patch(':id')
  @UseGuards(TokenGuard)
  public async update(@Body() updateModel: PartialClipDto,
                      @Param('id') clipId: string): Promise<ClipDto> {
    updateModel.id = clipId;
    return await this.clipsService.updateClip(updateModel);
  }

  @Get(':id/songs')
  @UseGuards(TokenGuard)
  public async getIdentifiedSongs(@Param('id') clipId: string): Promise<IdentifiedSong[]> {
    const video = await this.clipsService.findOne(clipId, ['identifiedSongs']);
    return video.identifiedSongs;
  }

  @Get(':id')
  @UseGuards(TokenGuard)
  public async getClip(@Param('id') clipId: string): Promise<ClipDto> {
    return await this.clipsService.findOne(clipId);
  }
}
