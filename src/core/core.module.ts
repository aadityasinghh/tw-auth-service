import { Module } from '@nestjs/common';
import { DatabaseModule } from './db/db.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [DatabaseModule, CommonModule],
  controllers: [],
  providers: [],
  exports: [CommonModule],
})
export class CoreModule {}
