import { TwitchUserDto } from '@twitch-audio-copyright/data';

export class UserAuthDto {

  user: TwitchUserDto;
  accessToken: string;
  refreshToken: string;

  constructor(user: TwitchUserDto, accessToken: string, refreshToken: string) {
    this.user = user;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}
