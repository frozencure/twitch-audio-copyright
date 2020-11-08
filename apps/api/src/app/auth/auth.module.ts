import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { TwitchStrategy } from './twitch.strategy';
import { AuthService } from './auth.service';

@Module({
  controllers: [ AuthController ],
  imports: [
    PassportModule
  ],
  providers: [ TwitchStrategy, AuthService ]
})
export class AuthModule {
}
