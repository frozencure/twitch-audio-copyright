import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-twitch-new';
import * as dotenv from 'dotenv';
import { UserAuthDto } from './model/user-auth-dto';
import { TwitchUser } from '../../../../../libs/data/src/lib/TwitchUser';

dotenv.config();

@Injectable()
export class TwitchStrategy extends PassportStrategy(Strategy, 'twitch') {
  constructor() {
    // TODO: find a way to make the redirect url dynamic
    super({
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: `http://localhost:3333/api/auth/twitch/redirect`,
      scope: 'user_read'
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: TwitchUser,
    done: (err: Error, user: UserAuthDto) => void
  ): Promise<void> {
    const userAuth = new UserAuthDto(profile,
      accessToken, refreshToken);
    done(null, userAuth);
  }
}
