import { TwitchUserDto } from '../../../../../../libs/data/src/lib/twitch-user-dto';

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
