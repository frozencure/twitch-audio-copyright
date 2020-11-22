import { Controller, Get, HttpStatus, Logger, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { TokenGuard } from './token-guard.service';
import { AuthService } from './auth.service';
import { SuccessDto } from '@twitch-audio-copyright/data';
import { Token } from '../utils/decorators';

@Controller('auth')
export class AuthController {

  constructor(private config: ConfigService, private authService: AuthService) {
  }

  @Get('/twitch')
  @UseGuards(AuthGuard('twitch'))
  async twitchLogin(): Promise<HttpStatus> {
    return HttpStatus.OK;
  }

  @Get('/twitch/redirect')
  @UseGuards(AuthGuard('twitch'))
  async twitchLoginRedirect(@Res() res: Response, @Req() req: Request): Promise<void> {
    const user = (req as any).user;
    Logger.log({
      statusCode: HttpStatus.OK,
      data: user
    });

    res.cookie('token', user.accessToken);
    res.cookie('user',
      JSON.stringify({
        id: user.id,
        login: user.login,
        display_name: user.display_name,
        profilePic: user.profile_image_url
      }));
    res.redirect(`${this.config.get('frontendUrl')}/dashboard`);
  }

  @Get('sync')
  @UseGuards(TokenGuard)
  async sync(): Promise<SuccessDto> {
    return new SuccessDto();
  }

  @Get('logout')
  @UseGuards(TokenGuard)
  async logout(@Token() token: string): Promise<SuccessDto> {
    try {
      await this.authService.revokeToken(token);
      return new SuccessDto('LOGOUT');
    } catch (e) {
      Logger.error(e);
    }
  }

}
