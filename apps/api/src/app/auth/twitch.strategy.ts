import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-twitch-new';
import * as dotenv from 'dotenv';

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
    profile: any,
    done: (err: any, user: any, info?: any) => void
  ): Promise<any> {
    const { id, login, display_name, profile_image_url } = profile;
    console.log(profile);
    const user = {
      accessToken,
      refreshToken,
      id,
      login,
      display_name,
      profile_image_url
    };
    const payload = {
      user,
      accessToken
    };

    done(null, payload);
  }
}
