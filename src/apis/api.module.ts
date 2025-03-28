import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { DatabaseModule } from 'src/core/db/db.module';

@Module({
  imports: [UserModule, DatabaseModule],
  providers: [],
})
export class ApiModule {}
