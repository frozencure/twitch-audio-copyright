import { Injectable } from '@angular/core';
import User from './user.entity';
import { TwitchUserDto } from '@twitch-audio-copyright/data';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {

  constructor(@InjectRepository(User) private usersRepository: Repository<User>) {
  }

  async insertOrUpdate(twitchUserDto: TwitchUserDto): Promise<User> {
    const user = User.FromTwitchUser(twitchUserDto);
    return await user.save();
  }

  async findOne(userId: string, relations?: string[]): Promise<User> {
    return await this.usersRepository.findOne(userId, {
      relations: relations
    });
  }
}
