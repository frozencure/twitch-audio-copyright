import { Controller, Get, HttpStatus, Logger, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { TokenGuard } from './token-guard.service';
import { AuthService } from './auth.service';
import { SuccessDto } from '@twitch-audio-copyright/data';
import { UserAuthDto } from './model/user-auth-dto';
import { UsersService } from '../database/user/users.service';
import { UserCookieModel } from './model/user-cookie-model';

@Controller('auth')
export class AuthController {

  constructor(private config: ConfigService, private authService: AuthService,
              private usersService: UsersService) {
  }

  @Get('/twitch')
  @UseGuards(AuthGuard('twitch'))
  async twitchLogin(): Promise<HttpStatus> {
    return HttpStatus.OK;
  }

  @Get('/twitch/redirect')
  @UseGuards(AuthGuard('twitch'))
  async twitchLoginRedirect(@Res() res: Response, @Req() req: Request): Promise<void> {
    const userAuthDto = (req as any).user as UserAuthDto;
    const dbUser = await this.usersService.insertOrUpdate(userAuthDto.user);
    Logger.debug(`User ${dbUser.displayName} (id: ${dbUser.id}) inserted or updated.`);
    res.cookie('token', userAuthDto.accessToken);
    res.cookie('user',
      JSON.stringify(new UserCookieModel(userAuthDto.user.id, userAuthDto.user.login)));
    res.redirect(`${this.config.get('frontendUrl')}/dashboard`);
  }

  @Get('sync')
  @UseGuards(TokenGuard)
  async sync(): Promise<SuccessDto> {
    return new SuccessDto();
  }

  @Get('logout')
  @UseGuards(TokenGuard)
  async logout(@Req() req: Request): Promise<SuccessDto> {
    try {
      await this.authService.revokeToken((req as any).cookies.token);
      return new SuccessDto('LOGOUT');
    } catch (e) {
      Logger.error(e);
    }
  }

}
