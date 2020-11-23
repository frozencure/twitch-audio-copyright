import { TwitchUser } from '../../../../../../libs/data/src/lib/TwitchUser';

export class UserAuthDto {

  user: TwitchUser;
  accessToken: string;
  refreshToken: string;


  constructor(user: TwitchUser, accessToken: string, refreshToken: string) {
    this.user = user;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}
