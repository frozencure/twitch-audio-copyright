import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserEntity from './entity/user.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([ UserEntity ]), HttpModule ],
  providers: [],
  exports: []
})
export class DatabaseModule {
}
