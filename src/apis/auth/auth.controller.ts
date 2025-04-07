import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Res,
  Get,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../../apis/user/dto/login-user.dto';
import { User } from '../../apis/user/entities/user.entity';
import { UserResponseDto } from '../../apis/user/dto/user-response.dto';
import { plainToClass } from 'class-transformer';
import { LocalAuthGuard } from 'src/core/auth/guards/local-auth.guard';
import { CurrentUser } from 'src/core/auth/decorators/current-user.decorator';
import { ApiResponse } from 'src/core/common/dto/api-response.dto';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { ChangePasswordDto } from '../user/dto/change-password.dto';

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
  @UseGuards(JwtAuthGuard)
  @Get('validate')
  @HttpCode(HttpStatus.OK)
  validateToken(@Req() request: Request): ApiResponse<UserResponseDto> {
    // The user will be attached to the request by the JwtAuthGuard
    const user = request.user as User;

    // Transform the user entity to the response DTO
    const userResponse = plainToClass(UserResponseDto, user);

    // Add the userId property required by the tour service
    const responseWithUserId = {
      ...userResponse,
      userId: user.user_id, // Ensure the tour service gets the user ID in the format it expects
    };
    console.log('has been hit');
    return ApiResponse.success(
      responseWithUserId,
      'Token validated successfully',
    );
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) response: Response): ApiResponse<null> {
    response.clearCookie('access_token', { path: '/' });

    return ApiResponse.success(null, 'Logout successful');
  }
}
