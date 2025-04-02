import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../../apis/user/dto/login-user.dto';
import { User } from '../../apis/user/entities/user.entity';
import { UserResponseDto } from '../../apis/user/dto/user-response.dto';
import { plainToClass } from 'class-transformer';
import { LocalAuthGuard } from 'src/core/auth/guards/local-auth.guard';
import { CurrentUser } from 'src/core/auth/decorators/current-user.decorator';
import { ApiResponse } from 'src/core/common/dto/api-response.dto';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(
    @Body() loginUserDto: LoginUserDto,
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ): ApiResponse<{ access_token: string; user: UserResponseDto }> {
    const authResult = this.authService.login(user);

    // Set the JWT token as an HTTP-only cookie
    const cookieOptions = {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production', // Only use secure in production
      maxAge: 24 * 60 * 60 * 1000, // 24 hours (match JWT expiry)
      path: '/',
      // sameSite: 'lax',
    };

    response.cookie('access_token', authResult.access_token, cookieOptions);

    return ApiResponse.success(
      {
        access_token: authResult.access_token,
        user: plainToClass(UserResponseDto, user),
      },
      'Login successful',
    );
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) response: Response): ApiResponse<null> {
    // Clear the authentication cookie
    response.clearCookie('access_token', { path: '/' });

    return ApiResponse.success(null, 'Logout successful');
  }
}
