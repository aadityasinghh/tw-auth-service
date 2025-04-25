import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../apis/user/user.service';
import * as bcrypt from 'bcrypt';
import { User, UserStatus } from '../../apis/user/entities/user.entity';
import { LoginUserDto } from '../../apis/user/dto/login-user.dto';
import { ChangePasswordDto } from '../../apis/user/dto/change-password.dto';
import { ResetPasswordDto } from '../../apis/user/dto/reset-password.dto';
import { NotificationService } from '../../apis/notification/notification.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { VerificationToken } from '../../apis/user/entities/verificiation-token.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly notificationService: NotificationService,
    @InjectRepository(VerificationToken)
    private tokenRepository: Repository<VerificationToken>,
    private connection: DataSource,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email, true);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Account is inactive or blocked');
    }
    if (!user.email_verified) {
      throw new UnauthorizedException(
        'Email not verified. Please verify your email before logging in.',
      );
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password: _, ...result } = user;
    return result;
  }

  login(user: any) {
    const payload = { email: user.email, sub: user.user_id };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async validateUserCredentials(loginUserDto: LoginUserDto) {
    return this.validateUser(loginUserDto.email, loginUserDto.password);
  }

  async initiatePasswordReset(email: string): Promise<void> {
    // Check if user exists but don't reveal this in response
    const user = await this.userService.findByEmail(email);

    if (!user) {
      // Don't throw an error to prevent email enumeration attacks
      // But also don't send an email
      return;
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15); // 15 minutes expiry

    // Start transaction
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Create or update password reset token
      const existingToken = await queryRunner.manager.findOne(
        VerificationToken,
        {
          where: {
            user_id: user.user_id,
            type: 'password_reset',
            is_used: false,
          },
        },
      );

      if (existingToken) {
        existingToken.token = otp;
        existingToken.expires_at = expiresAt;
        await queryRunner.manager.save(existingToken);
      } else {
        const verificationToken = this.tokenRepository.create({
          user_id: user.user_id,
          token: otp,
          type: 'password_reset',
          expires_at: expiresAt,
          is_used: false,
        });
        await queryRunner.manager.save(verificationToken);
      }

      // Send password reset OTP via notification service
      // await this.notificationService.sendNotification({
      //   type: 'email',
      //   template: 'password-reset',
      //   recipient: user.email,
      //   content: {
      //     name: user.name || 'User',
      //     otpCode: otp,
      //   },
      // });
      await this.notificationService.sendOtpEmail(user.email, user.name, otp);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Failed to process password reset request');
    } finally {
      await queryRunner.release();
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const { email, otp, newPassword, confirmNewPassword } = resetPasswordDto;

    if (newPassword !== confirmNewPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // Start transaction
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await this.userService.findByEmail(email, true);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Find the verification token
      const verificationToken = await queryRunner.manager.findOne(
        VerificationToken,
        {
          where: {
            user_id: user.user_id,
            token: otp,
            type: 'password_reset',
            is_used: false,
          },
        },
      );

      if (!verificationToken) {
        throw new UnauthorizedException('Invalid OTP');
      }

      // Check if token is expired
      if (new Date() > verificationToken.expires_at) {
        throw new UnauthorizedException('OTP has expired');
      }

      // Mark token as used
      verificationToken.is_used = true;
      await queryRunner.manager.save(verificationToken);

      // Hash and update password
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      user.password = hashedPassword;
      await queryRunner.manager.save(user);

      // Send password reset success notification
      // await this.notificationService.sendNotification({
      //   type: 'email',
      //   template: 'password-reset-success',
      //   recipient: user.email,
      //   content: {
      //     name: user.name || 'User',
      //   },
      // });
      await this.notificationService.sendEmailVerificationSuccess(
        user.email,
        user.name,
      );

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    const { currentPassword, newPassword, confirmNewPassword } =
      changePasswordDto;
    console.log(userId, changePasswordDto);
    if (newPassword !== confirmNewPassword) {
      throw new BadRequestException('New passwords do not match');
    }

    // Get the user with password field (need to explicitly select it)
    const userWithPassword = await this.connection
      .getRepository(User)
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.user_id = :userId', { userId })
      .getOne();

    // Check if user exists
    if (!userWithPassword) {
      throw new NotFoundException('User not found');
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      userWithPassword.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Start transaction
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Hash and update password
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      userWithPassword.password = hashedPassword;
      await queryRunner.manager.save(userWithPassword);

      await this.notificationService.sendEmailVerificationSuccess(
        userWithPassword.email,
        userWithPassword.name,
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getUserEmail(userId: string): Promise<string> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user.email;
  }
}
