import { Module } from '@nestjs/common';
import { TwitchService } from './twitch.service';

@Module({
  exports: [TwitchService],
  providers: [TwitchService]
})
export class TwitchModule {
}
