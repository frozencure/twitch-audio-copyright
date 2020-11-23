import { HttpModule, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { TwitchStrategy } from './twitch.strategy';
import { AuthService } from './auth.service';
import { DatabaseModule } from '../database/database.module';
import { UsersService } from '../database/user/users.service';

@Module({
  controllers: [AuthController],
  imports: [
    PassportModule,
    HttpModule,
    DatabaseModule
  ],
  providers: [TwitchStrategy, AuthService],
  exports: [AuthService]
})
export class AuthModule {
}
