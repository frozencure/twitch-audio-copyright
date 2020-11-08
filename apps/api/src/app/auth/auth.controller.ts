import { Controller, Get, HttpStatus, Logger, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {

  constructor(private config: ConfigService) {
  }

  @Get('/twitch')
  @UseGuards(AuthGuard('twitch'))
  async twitchLogin(): Promise<any> {
    return HttpStatus.OK;
  }

  @Get('/twitch/redirect')
  @UseGuards(AuthGuard('twitch'))
  async twitchLoginRedirect(@Res() res: Response, @Req() req: Request): Promise<any> {
    Logger.log({
      statusCode: HttpStatus.OK,
      data: (req as any).user
    });

    res.cookie('token', (req as any).user.accessToken);
    return res.redirect(`${ this.config.get('frontendUrl') }/dashboard`);
  }

}
