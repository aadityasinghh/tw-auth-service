import { Module } from '@nestjs/common';
import { DatabaseModule } from './db/db.module';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [],
})
export class CoreModule {}
