import { Injectable } from '@angular/core';
import User from './user.entity';
import { TwitchUser } from '../../../../../../libs/data/src/lib/TwitchUser';


@Injectable()
export class UsersService {

  async insertOrUpdate(twitchUserDto: TwitchUser): Promise<User> {
    const user = new User();
    user.id = twitchUserDto.id;
    user.userName = twitchUserDto.login;
    user.displayName = twitchUserDto.display_name;
    user.type = twitchUserDto.type;
    user.description = twitchUserDto.description;
    user.profileImageUrl = twitchUserDto.profile_image_url;
    user.offlineImageUrl = twitchUserDto.offline_image_url;
    user.viewCount = twitchUserDto.view_count;
    user.email = twitchUserDto.email;
    return await user.save();
  }

}
