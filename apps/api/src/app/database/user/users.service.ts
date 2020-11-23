import { Injectable } from '@angular/core';
import User from './user.entity';
import { TwitchUserDto } from '../../../../../../libs/data/src/lib/twitch-user-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


@Injectable()
export class UsersService {

  constructor(@InjectRepository(User) private usersRepository: Repository<User>) {
  }

  async insertOrUpdate(twitchUserDto: TwitchUserDto): Promise<User> {
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

  async findOne(userId: string): Promise<User> {
    return await this.usersRepository.findOne(userId);
  }

}
