import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

const queues = BullModule.registerQueueAsync({
  name: 'download'
}, {
  name: 'ffmpeg'
}, {
  name: 'file-system'
});

@Module({
  imports: [queues],
  exports: [queues]
})
export class QueueModule {
}
