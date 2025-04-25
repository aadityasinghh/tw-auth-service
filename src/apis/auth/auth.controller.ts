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
  Patch,
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
import { ForgotPasswordDto } from '../user/dto/forgot-password.dto';
import { ResetPasswordDto } from '../user/dto/reset-password.dto';
import { VerifiedUserGuard } from 'src/core/auth/guards/verified-user.guard';
import { ApiKey } from 'src/core/auth/decorators/api-key-decorator';
import { ApiKeyGuard } from 'src/core/auth/guards/api-key.gaurd';
// import { ThrottlerGuard } from '@nestjs/';

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

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  // @UseGuards(ThrottlerGuard)
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<ApiResponse<null>> {
    await this.authService.initiatePasswordReset(forgotPasswordDto.email);
    return ApiResponse.success(
      null,
      'If your email is registered with us, you will receive a password reset OTP.',
    );
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<ApiResponse<null>> {
    await this.authService.resetPassword(resetPasswordDto);
    return ApiResponse.success(
      null,
      'Password has been reset successfully. You can now login with your new password.',
    );
  }

  @UseGuards(JwtAuthGuard, VerifiedUserGuard)
  @Patch('change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @CurrentUser() user: User,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<ApiResponse<null>> {
    await this.authService.changePassword(user.user_id, changePasswordDto);
    return ApiResponse.success(null, 'Password changed successfully.');
  }

  // @UseGuards(ApiKeyGuard, ThrottlerGuard)
  @Get('user-email/:id')
  @HttpCode(HttpStatus.OK)
  @ApiKey() // Custom decorator to enforce API key
  async getUserEmail(
    @Req() request: Request,
  ): Promise<ApiResponse<{ email: string }>> {
    const userId = request.params.id;
    const email = await this.authService.getUserEmail(userId);
    return ApiResponse.success({ email }, 'User email retrieved successfully');
  }
}
