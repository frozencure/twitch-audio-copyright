import { Controller, Get, HttpStatus, Logger, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { TokenGuard } from './token-guard.service';

@Controller('auth')
export class AuthController {

  constructor(private config: ConfigService) {
  }

  @Get('/twitch')
  @UseGuards(AuthGuard('twitch'))
  async twitchLogin(): Promise<HttpStatus> {
    return HttpStatus.OK;
  }

  @Get('/twitch/redirect')
  @UseGuards(AuthGuard('twitch'))
  async twitchLoginRedirect(@Res() res: Response, @Req() req: Request): Promise<void> {
    Logger.log({
      statusCode: HttpStatus.OK,
      data: (req as any).user
    });

    res.cookie('token', (req as any).user.accessToken);
    res.redirect(`${ this.config.get('frontendUrl') }/dashboard`);
  }

  @Get('sync')
  @UseGuards(TokenGuard)
  async sync(@Req() req: Request): Promise<boolean> {
    return true;
  }

}
