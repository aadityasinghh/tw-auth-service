import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiResponse } from '../../core/common/dto/api-response.dto';
import { User, UserStatus } from './entities/user.entity';
import { JwtAuthGuard } from '../../core/auth/guards/jwt-auth.guard';
// import { VerifiedUserGuard } from '../../core/auth/guards/verified-user.guard';
import { CurrentUser } from '../../core/auth/decorators/current-user.decorator';
import { UserResponseDto } from './dto/user-response.dto';
import { plainToClass } from 'class-transformer';
import { RegisterUserDto } from './dto/email-verification.dto';
import { VerifyEmailDto } from './dto/email-verification.dto';
import { ResendOtpDto } from './dto/email-verification.dto';
import { VerifiedUserGuard } from 'src/core/auth/guards/verified-user.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
  async register(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<ApiResponse<null>> {
    await this.userService.register(registerUserDto);
    return ApiResponse.success(
      null,
      'Registration initiated. Please check your email for the verification OTP.',
    );
  }

  @Post('verify-email')
  async verifyEmail(
    @Body() verifyEmailDto: VerifyEmailDto,
  ): Promise<ApiResponse<UserResponseDto>> {
    const user = await this.userService.verifyEmail(verifyEmailDto);
    return ApiResponse.success(
      plainToClass(UserResponseDto, user),
      'Email verified successfully. Your account is now active.',
    );
  }

  @Post('resend-otp')
  @HttpCode(HttpStatus.OK)
  async resendOtp(
    @Body() resendOtpDto: ResendOtpDto,
  ): Promise<ApiResponse<null>> {
    await this.userService.resendOtp(resendOtpDto);
    return ApiResponse.success(
      null,
      'Verification OTP sent. Please check your email.',
    );
  }

  @UseGuards(JwtAuthGuard, VerifiedUserGuard)
  @Get()
  async findAll(): Promise<ApiResponse<UserResponseDto[]>> {
    const users = await this.userService.findAll();
    return ApiResponse.success(
      users.map((user) => plainToClass(UserResponseDto, user)),
      'Users retrieved successfully',
    );
  }

  @UseGuards(JwtAuthGuard, VerifiedUserGuard)
  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<ApiResponse<UserResponseDto>> {
    const user = await this.userService.findById(id);
    return ApiResponse.success(
      plainToClass(UserResponseDto, user),
      'User retrieved successfully',
    );
  }

  @UseGuards(JwtAuthGuard, VerifiedUserGuard)
  @Get('profile/me')
  getProfile(@CurrentUser() user: User): ApiResponse<UserResponseDto> {
    return ApiResponse.success(
      plainToClass(UserResponseDto, user),
      'Profile retrieved successfully',
    );
  }

  @UseGuards(JwtAuthGuard, VerifiedUserGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ApiResponse<UserResponseDto>> {
    const updatedUser = await this.userService.update(id, updateUserDto);
    return ApiResponse.success(
      plainToClass(UserResponseDto, updatedUser),
      'User updated successfully',
    );
  }

  @UseGuards(JwtAuthGuard, VerifiedUserGuard)
  @Patch(':id/verify-aadhaar')
  async verifyAadhaar(
    @Param('id') id: string,
  ): Promise<ApiResponse<UserResponseDto>> {
    const updatedUser = await this.userService.verifyAadhaar(id);
    return ApiResponse.success(
      plainToClass(UserResponseDto, updatedUser),
      'Aadhaar verified successfully',
    );
  }

  @UseGuards(JwtAuthGuard, VerifiedUserGuard)
  @Patch(':id/status')
  async changeStatus(
    @Param('id') id: string,
    @Body('status') status: UserStatus,
  ): Promise<ApiResponse<UserResponseDto>> {
    const updatedUser = await this.userService.changeStatus(id, status);
    return ApiResponse.success(
      plainToClass(UserResponseDto, updatedUser),
      'User status updated successfully',
    );
  }

  @UseGuards(JwtAuthGuard, VerifiedUserGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.userService.delete(id);
  }
}
