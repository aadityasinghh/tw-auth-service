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
    Patch,
    Param,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../../apis/user/dto/login-user.dto';
import { User } from '../../apis/user/entities/user.entity';
import { UserResponseDto } from '../../apis/user/dto/user-response.dto';
import { plainToClass } from 'class-transformer';
import { LocalAuthGuard } from '../../core/auth/guards/local-auth.guard';
import { CurrentUser } from '../../core/auth/decorators/current-user.decorator';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '../../core/auth/guards/jwt-auth.guard';
import { ChangePasswordDto } from '../user/dto/change-password.dto';
import { ForgotPasswordDto } from '../user/dto/forgot-password.dto';
import { ResetPasswordDto } from '../user/dto/reset-password.dto';
import { VerifiedUserGuard } from '../../core/auth/guards/verified-user.guard';
import { ApiKey } from '../../core/auth/decorators/api-key-decorator';
// import { ApiKeyGuard } from '../../core/auth/guards/api-key.gaurd';
import { ResponseService } from '../../core/common/services/response.service';
import { ResponseMessages } from '../../core/common/constants/response-messages.constant';
// import { ThrottlerGuard } from '@nestjs/';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
        private readonly responseService: ResponseService,
    ) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    @HttpCode(HttpStatus.OK)
    login(
        @Body() loginUserDto: LoginUserDto,
        @CurrentUser() user: User,
        @Res({ passthrough: true }) response: Response,
    ) {
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

        return this.responseService.success(
            {
                access_token: authResult.access_token,
                user: plainToClass(UserResponseDto, user),
            },
            ResponseMessages.AUTH_SUCCESS,
        );
    }

    @UseGuards(JwtAuthGuard)
    @Get('validate')
    @HttpCode(HttpStatus.OK)
    validateToken(@Req() request: Request) {
        // The user will be attached to the request by the JwtAuthGuard
        const user = request.user as User;

        // Transform the user entity to the response DTO
        const userResponse = plainToClass(UserResponseDto, user);

        // Add the userId property required by the tour service
        const responseWithUserId = {
            ...userResponse,
            userId: user.user_id, // Ensure the tour service gets the user ID in the format it expects
        };

        return this.responseService.success(
            responseWithUserId,
            ResponseMessages.TOKEN_VALIDATION_SUCCESS,
        );
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    logout(@Res({ passthrough: true }) response: Response) {
        response.clearCookie('access_token', { path: '/' });

        return this.responseService.success(
            null,
            ResponseMessages.LOGOUT_SUCCESS,
        );
    }

    @Post('forgot-password')
    @HttpCode(HttpStatus.OK)
    // @UseGuards(ThrottlerGuard)
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
        await this.authService.initiatePasswordReset(forgotPasswordDto.email);
        return this.responseService.success(
            null,
            ResponseMessages.IF_EMAIL_IS_REGISTERED,
        );
    }

    @Post('reset-password')
    @HttpCode(HttpStatus.OK)
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        await this.authService.resetPassword(resetPasswordDto);
        return this.responseService.success(
            null,
            ResponseMessages.PASSWORD_RESET_SUCCESS,
        );
    }

    @UseGuards(JwtAuthGuard, VerifiedUserGuard)
    @Patch('change-password')
    @HttpCode(HttpStatus.OK)
    async changePassword(
        @CurrentUser() user: User,
        @Body() changePasswordDto: ChangePasswordDto,
    ) {
        await this.authService.changePassword(user.user_id, changePasswordDto);
        return this.responseService.success(
            null,
            ResponseMessages.PASSWORD_CHANGE_SUCCESS,
        );
    }

    // @UseGuards(ApiKeyGuard, ThrottlerGuard)
    // @UseGuards(ApiKeyGuard)
    @Get('user-email/:id')
    @HttpCode(HttpStatus.OK)
    @ApiKey() // Custom decorator to enforce API key
    async getUserEmail(@Param('id') userId: string) {
        const email = await this.authService.getUserEmail(userId);
        return this.responseService.success(
            email,
            ResponseMessages.EMAIL_RETRIEVAL_SUCCESS,
        );
    }
}
