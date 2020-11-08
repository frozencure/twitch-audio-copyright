import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { TwitchStrategy } from './twitch.strategy';

@Module({
  controllers: [ AuthController ],
  imports: [
    PassportModule
  ],
  providers: [ TwitchStrategy ]
})
export class AuthModule {
}
