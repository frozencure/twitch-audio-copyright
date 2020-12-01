import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';
import { ClipController } from './clip.controller';

@Module({
  controllers: [ClipController],
  imports: [
    DatabaseModule,
    AuthModule
  ]
})
export class ClipModule {
}
