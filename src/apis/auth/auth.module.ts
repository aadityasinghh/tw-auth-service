import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { UserModule } from '../../apis/user/user.module';
import { AuthController } from './auth.controller';
import { JwtStrategy } from 'src/core/auth/strategies/jwt.strategy';
import { LocalStrategy } from 'src/core/auth/strategies/local.strategy';
import { NotificationService } from '../notification/notification.service';
import { VerificationToken } from '../user/entities/verificiation-token.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { ResponseService } from 'src/core/common/services/response.service';

@Module({
  imports: [
    UserModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'superSecretKey'),
        signOptions: { expiresIn: '24h' },
      }),
    }),
    TypeOrmModule.forFeature([VerificationToken]),
    HttpModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    NotificationService,
    ResponseService

    // VerificationToken,
  ],
  exports: [AuthService],
})
export class AuthModule {}
