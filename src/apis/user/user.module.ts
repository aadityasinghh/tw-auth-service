import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from 'src/core/db/db.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { VerificationToken } from './entities/verificiation-token.entity';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { NotificationService } from '../notification/notification.service';
import { ResponseService } from 'src/core/common/services/response.service';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([User, VerificationToken]),
    HttpModule,
    ConfigModule,
  ],
  providers: [UserService, NotificationService, ResponseService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
