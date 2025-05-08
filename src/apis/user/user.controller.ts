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
    Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserStatus } from './entities/user.entity';
import { JwtAuthGuard } from '../../core/auth/guards/jwt-auth.guard';
// import { VerifiedUserGuard } from '../../core/auth/guards/verified-user.guard';
import { CurrentUser } from '../../core/auth/decorators/current-user.decorator';
import { UserResponseDto } from './dto/user-response.dto';
import { plainToClass } from 'class-transformer';
import { RegisterUserDto } from './dto/email-verification.dto';
import { VerifyEmailDto } from './dto/email-verification.dto';
import { ResendOtpDto } from './dto/email-verification.dto';
import { VerifiedUserGuard } from '../../core/auth/guards/verified-user.guard';
import { ResponseService } from '../../core/common/services/response.service';
import { ResponseMessages } from '../../core/common/constants/response-messages.constant';
import { ApiResponse } from '../../core/common/interfaces/api-response.interface';
import { Request } from 'express';

// Extended Request interface that includes the user property
interface RequestWithUser extends Request {
    user: User;
}

@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly responseService: ResponseService,
    ) {}

    @Post('register')
    @HttpCode(HttpStatus.OK)
    async register(
        @Body() registerUserDto: RegisterUserDto,
    ): Promise<ApiResponse<null>> {
        await this.userService.register(registerUserDto);
        return this.responseService.success(
            null,
            ResponseMessages.REGISTRATION_INITIATED_SUCCESS,
        );
    }

    @Post('verify-email')
    async verifyEmail(
        @Body() verifyEmailDto: VerifyEmailDto,
    ): Promise<ApiResponse<UserResponseDto>> {
        const user = await this.userService.verifyEmail(verifyEmailDto);
        return this.responseService.success(
            plainToClass(UserResponseDto, user),
            ResponseMessages.EMAIL_VERIFICATION_SUCCESS,
        );
    }

    @Post('resend-otp')
    @HttpCode(HttpStatus.OK)
    async resendOtp(
        @Body() resendOtpDto: ResendOtpDto,
    ): Promise<ApiResponse<null>> {
        await this.userService.resendOtp(resendOtpDto);
        return this.responseService.success(
            null,
            ResponseMessages.VERIFICATION_OTP_SENT,
        );
    }

    @UseGuards(JwtAuthGuard, VerifiedUserGuard)
    @Get()
    async findAll(): Promise<ApiResponse<UserResponseDto[]>> {
        const users = await this.userService.findAll();
        return this.responseService.success(
            users.map((user) => plainToClass(UserResponseDto, user)),
            ResponseMessages.USERS_RETRIEVAL_SUCCESS,
        );
    }

    @UseGuards(JwtAuthGuard, VerifiedUserGuard)
    @Get(':id')
    async findOne(
        @Param('id') id: string,
    ): Promise<ApiResponse<UserResponseDto>> {
        const user = await this.userService.findById(id);
        return this.responseService.success(
            plainToClass(UserResponseDto, user),
            ResponseMessages.USER_RETRIEVAL_SUCCESS,
        );
    }

    @UseGuards(JwtAuthGuard, VerifiedUserGuard)
    @Get('profile/me')
    getProfile(@CurrentUser() user: User): ApiResponse<UserResponseDto> {
        return this.responseService.success(
            plainToClass(UserResponseDto, user),
            ResponseMessages.PROFILE_RETRIEVAL_SUCCESS,
        );
    }

    @UseGuards(JwtAuthGuard, VerifiedUserGuard)
    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
        @Req() req: RequestWithUser,
    ): Promise<ApiResponse<UserResponseDto>> {
        const updatedUser = await this.userService.update(
            id,
            updateUserDto,
            req.user.user_id,
        );
        return this.responseService.success(
            plainToClass(UserResponseDto, updatedUser),
            ResponseMessages.USER_UPDATED,
        );
    }

    @UseGuards(JwtAuthGuard, VerifiedUserGuard)
    @Patch(':id/verify-aadhaar')
    async verifyAadhaar(
        @Param('id') id: string,
    ): Promise<ApiResponse<UserResponseDto>> {
        const updatedUser = await this.userService.verifyAadhaar(id);
        return this.responseService.success(
            plainToClass(UserResponseDto, updatedUser),
            ResponseMessages.AADHAR_VERIFICATION_SUCCESS,
        );
    }

    @UseGuards(JwtAuthGuard, VerifiedUserGuard)
    @Patch(':id/status')
    async changeStatus(
        @Param('id') id: string,
        @Body('status') status: UserStatus,
    ): Promise<ApiResponse<UserResponseDto>> {
        const updatedUser = await this.userService.changeStatus(id, status);
        return this.responseService.success(
            plainToClass(UserResponseDto, updatedUser),
            ResponseMessages.USER_UPDATED,
        );
    }

    @UseGuards(JwtAuthGuard, VerifiedUserGuard)
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id') id: string): Promise<void> {
        await this.userService.delete(id);
    }

    @UseGuards(JwtAuthGuard, VerifiedUserGuard)
    @Delete('me')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteSelf(@CurrentUser() user: User): Promise<void> {
        await this.userService.delete(user.user_id);
    }

    @UseGuards(JwtAuthGuard, VerifiedUserGuard)
    @Get('me/email')
    async getMyEmail(
        @Req() req: RequestWithUser,
    ): Promise<ApiResponse<{ email: string }>> {
        const email = await this.userService.getUserEmail(req.user.user_id);
        return this.responseService.success(email);
    }
}
