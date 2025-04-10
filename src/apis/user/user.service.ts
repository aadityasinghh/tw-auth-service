import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserStatus } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { VerificationToken } from './entities/verificiation-token.entity';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { RegisterUserDto } from './dto/email-verification.dto';
import { VerifyEmailDto } from './dto/email-verification.dto';
import { ResendOtpDto } from './dto/email-verification.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(VerificationToken)
    private tokenRepository: Repository<VerificationToken>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { user_id: id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(
    email: string,
    includePassword = false,
  ): Promise<User | null> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email });

    if (includePassword) {
      queryBuilder.addSelect('user.password');
    }

    return queryBuilder.getOne();
  }

  // First step: Register and send OTP
  async register(registerUserDto: RegisterUserDto): Promise<void> {
    // Check if email exists
    const emailExists = await this.userRepository.findOne({
      where: { email: registerUserDto.email },
    });

    if (emailExists && emailExists.email_verified) {
      throw new ConflictException('Email already exists');
    } else if (emailExists && !emailExists.email_verified) {
      // If user exists but email not verified, resend verification
      await this.sendVerificationOtp(registerUserDto.email);
      return;
    }

    // Check if phone exists
    // const phoneExists = await this.userRepository.findOne({
    //   where: { phone_number: registerUserDto.phone_number },
    // });
    // if (phoneExists) {
    //   throw new ConflictException('Phone number already exists');
    // }

    // Hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(registerUserDto.password, salt);

    // Create new user with pending status
    const newUser = this.userRepository.create({
      ...registerUserDto,
      password: hashedPassword,
      status: UserStatus.PENDING,
      email_verified: false,
    });

    const savedUser = await this.userRepository.save(newUser);

    // Send verification OTP
    await this.sendVerificationOtp(savedUser.email);
  }

  // Generate and send OTP
  async sendVerificationOtp(email: string): Promise<void> {
    const user = await this.findByEmail(email);

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set expiration time (15 minutes from now)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    // Create or update verification token
    const existingToken = await this.tokenRepository.findOne({
      where: {
        user_id: user.user_id,
        type: 'email',
        is_used: false,
      },
    });

    if (existingToken) {
      // Update existing token
      existingToken.token = otp;
      existingToken.expires_at = expiresAt;
      await this.tokenRepository.save(existingToken);
    } else {
      // Create new token
      const verificationToken = this.tokenRepository.create({
        user_id: user.user_id,
        token: otp,
        type: 'email',
        expires_at: expiresAt,
        is_used: false,
      });
      await this.tokenRepository.save(verificationToken);
    }

    // Send OTP via notification service
    try {
      const notificationServiceUrl = this.configService.get<string>(
        'NOTIFICATION_SERVICE_URL',
        'http://localhost:3000/notifications/send',
      );

      await firstValueFrom(
        this.httpService.post(notificationServiceUrl, {
          type: 'email',
          template: 'otp-verification',
          recipient: user.email,
          content: {
            name: user.name || 'User',
            otpCode: otp,
          },
        }),
      );
    } catch (error) {
      console.error('Failed to send verification email:', error);
      throw new BadRequestException('Failed to send verification email');
    }
  }

  // Second step: Verify OTP and activate account
  async verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<User> {
    const { email, otp } = verifyEmailDto;
    const user = await this.findByEmail(email);

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    if (user.email_verified) {
      throw new BadRequestException('Email is already verified');
    }

    // Find the verification token
    const verificationToken = await this.tokenRepository.findOne({
      where: {
        user_id: user.user_id,
        token: otp,
        type: 'email',
        is_used: false,
      },
    });

    if (!verificationToken) {
      throw new UnauthorizedException('Invalid OTP');
    }

    // Check if token is expired
    if (new Date() > verificationToken.expires_at) {
      throw new UnauthorizedException('OTP has expired');
    }

    // Mark token as used
    verificationToken.is_used = true;
    await this.tokenRepository.save(verificationToken);

    // Activate the user account
    user.email_verified = true;
    user.status = UserStatus.ACTIVE;
    return this.userRepository.save(user);
  }

  // Resend OTP if needed
  async resendOtp(resendOtpDto: ResendOtpDto): Promise<void> {
    await this.sendVerificationOtp(resendOtpDto.email);
  }

  // Original methods with adjustments for the new flow
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);

    // Check if user is verified before allowing updates
    if (user.status === UserStatus.PENDING) {
      throw new BadRequestException(
        'Account not verified. Please verify your email first.',
      );
    }

    // Check if email exists and is different
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const emailExists = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });
      if (emailExists) {
        throw new ConflictException('Email already exists');
      }

      // Reset email verification if email is changed
      user.email_verified = false;
      user.status = UserStatus.PENDING;

      // Save user first with the new email
      const updatedUser = await this.userRepository.save({
        ...user,
        email: updateUserDto.email,
      });

      // Send verification email to the new email address
      await this.sendVerificationOtp(updateUserDto.email);

      // Return user with other updates applied
      delete updateUserDto.email;
      if (Object.keys(updateUserDto).length === 0) {
        return updatedUser;
      }
    }

    // Check if phone exists
    if (
      updateUserDto.phone_number &&
      updateUserDto.phone_number !== user?.phone_number
    ) {
      const phoneExists = await this.userRepository.findOne({
        where: { phone_number: updateUserDto.phone_number },
      });
      if (phoneExists) {
        throw new ConflictException('Phone number already exists');
      }
    }

    // Check if Aadhaar exists
    if (
      updateUserDto.aadhar_number &&
      updateUserDto.aadhar_number !== user.aadhaar_number
    ) {
      const aadhaarExists = await this.userRepository.findOne({
        where: { aadhaar_number: updateUserDto.aadhar_number },
      });
      if (aadhaarExists) {
        throw new ConflictException('Aadhaar number already exists');
      }
    }

    // Hash password if provided
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    // Update user
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async verifyAadhaar(userId: string): Promise<User> {
    const user = await this.findById(userId);

    // Check if user is verified before allowing updates
    if (user.status === UserStatus.PENDING) {
      throw new BadRequestException(
        'Account not verified. Please verify your email first.',
      );
    }

    if (!user.aadhaar_number) {
      throw new BadRequestException('Aadhaar number not provided');
    }

    // In a real application, you would call an external Aadhaar verification service here
    user.aadhaar_verified = true;
    return this.userRepository.save(user);
  }

  async changeStatus(userId: string, status: UserStatus): Promise<User> {
    const user = await this.findById(userId);

    // Don't allow changing to ACTIVE if email isn't verified
    if (status === UserStatus.ACTIVE && !user.email_verified) {
      throw new BadRequestException(
        'Cannot activate account. Email not verified.',
      );
    }

    user.status = status;
    return this.userRepository.save(user);
  }

  async delete(id: string): Promise<void> {
    const user = await this.findById(id);
    await this.userRepository.remove(user);
  }
}
