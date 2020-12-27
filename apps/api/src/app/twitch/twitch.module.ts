import { HttpModule, Module } from '@nestjs/common';
import { TwitchService } from './twitch.service';

@Module({
  imports: [HttpModule],
  exports: [TwitchService],
  providers: [TwitchService]
})
export class TwitchModule {
}
