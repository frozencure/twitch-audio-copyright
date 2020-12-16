import { Injectable } from '@angular/core';
import UserEntity from './user.entity';
import { TwitchUserDto } from '@twitch-audio-copyright/data';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {

  constructor(@InjectRepository(UserEntity) private usersRepository: Repository<UserEntity>) {
  }

  async insertOrUpdate(twitchUserDto: TwitchUserDto): Promise<UserEntity> {
    const user = UserEntity.FromTwitchUser(twitchUserDto);
    return await user.save();
  }

  async findOne(userId: string, relations?: string[]): Promise<UserEntity> {
    return await this.usersRepository.findOne(userId, {
      relations: relations
    });
  }
}
