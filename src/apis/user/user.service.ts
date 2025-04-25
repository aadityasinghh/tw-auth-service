import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import { User, UserStatus } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { VerificationToken } from './entities/verificiation-token.entity';
import { NotificationService } from '../notification/notification.service';
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
    private readonly notificationService: NotificationService,
    private connection: Connection,
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
    // Start transaction
    const queryRunner = this.connection.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      // Check if email exists
      const emailExists = await queryRunner.manager.findOne(User, {
        where: { email: registerUserDto.email },
      });

      if (emailExists && emailExists.email_verified) {
        throw new ConflictException('Email already exists');
      } else if (emailExists && !emailExists.email_verified) {
        // If user exists but email not verified, resend verification
        await queryRunner.commitTransaction();
        await this.sendVerificationOtp(registerUserDto.email);
        return;
      }

      //  if(emailExists && emailExists.email_verified && emailExists.phone_number===registerUserDto.phone_number ){
      // throw new ConflictException('Phone Number already exists')
      //  }
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(registerUserDto.password, salt);

      // Create new user with pending status
      const newUser = this.userRepository.create({
        ...registerUserDto,
        password: hashedPassword,
        status: UserStatus.PENDING,
        email_verified: false,
      });

      const savedUser = await queryRunner.manager.save(newUser);

      // Send verification OTP
      await queryRunner.commitTransaction();
      await this.sendVerificationOtp(savedUser.email);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // Generate and send OTP
  async sendVerificationOtp(email: string): Promise<void> {
    const user = await this.findByEmail(email);

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    // Start transaction
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Generate a 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // Set expiration time (15 minutes from now)
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 15);

      // Create or update verification token
      const existingToken = await queryRunner.manager.findOne(
        VerificationToken,
        {
          where: {
            user_id: user.user_id,
            type: 'email',
            is_used: false,
          },
        },
      );

      if (existingToken) {
        // Update existing token
        existingToken.token = otp;
        existingToken.expires_at = expiresAt;
        await queryRunner.manager.save(existingToken);
      } else {
        // Create new token
        const verificationToken = this.tokenRepository.create({
          user_id: user.user_id,
          token: otp,
          type: 'email',
          expires_at: expiresAt,
          is_used: false,
        });
        await queryRunner.manager.save(verificationToken);
      }

      // Send OTP via notification service
      await this.notificationService.sendOtpEmail(user.email, user.name, otp);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Failed to send verification email:', error);
      throw new BadRequestException('Failed to send verification email');
    } finally {
      await queryRunner.release();
    }
  }

  // Second step: Verify OTP and activate account
  async verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<User> {
    const { email, otp } = verifyEmailDto;

    // Start transaction
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await this.findByEmail(email);

      if (!user) {
        throw new NotFoundException(`User with email ${email} not found`);
      }

      if (user.email_verified) {
        throw new BadRequestException('Email is already verified');
      }

      // Find the verification token
      const verificationToken = await queryRunner.manager.findOne(
        VerificationToken,
        {
          where: {
            user_id: user.user_id,
            token: otp,
            type: 'email',
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

      // Activate the user account
      user.email_verified = true;
      user.status = UserStatus.ACTIVE;
      const updatedUser = await queryRunner.manager.save(user);
      console.log('updateduser', updatedUser);
      // Send verification success email
      await queryRunner.commitTransaction();
      await this.notificationService.sendEmailVerificationSuccess(
        user.email,
        user.name,
      );

      return updatedUser;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // Resend OTP if needed
  async resendOtp(resendOtpDto: ResendOtpDto): Promise<void> {
    await this.sendVerificationOtp(resendOtpDto.email);
  }

  // Original methods with adjustments for the new flow
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // Remove email from updateUserDto to prevent email changes
    if (updateUserDto.email) {
      delete updateUserDto.email;
    }

    // Start transaction
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await this.findById(id);

      // Check if user is verified before allowing updates
      if (user.status === UserStatus.PENDING) {
        throw new BadRequestException(
          'Account not verified. Please verify your email first.',
        );
      }

      // Check if phone exists
      if (
        updateUserDto.phone_number &&
        updateUserDto.phone_number !== user?.phone_number
      ) {
        const phoneExists = await queryRunner.manager.findOne(User, {
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
        const aadhaarExists = await queryRunner.manager.findOne(User, {
          where: { aadhaar_number: updateUserDto.aadhar_number },
        });
        if (aadhaarExists) {
          throw new ConflictException('Aadhaar number already exists');
        }
      }

      // Hash password if provided
      if (updateUserDto.password) {
        const salt = await bcrypt.genSalt();
        updateUserDto.password = await bcrypt.hash(
          updateUserDto.password,
          salt,
        );
      }

      // Update user
      Object.assign(user, updateUserDto);
      const updatedUser = await queryRunner.manager.save(user);

      await queryRunner.commitTransaction();
      await this.notificationService.sendUserDetailsUpdateEmail(
        user.email,
        user.name,
      );
      return updatedUser;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async verifyAadhaar(userId: string): Promise<User> {
    // Start transaction
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
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
      const updatedUser = await queryRunner.manager.save(user);

      await queryRunner.commitTransaction();
      return updatedUser;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async changeStatus(userId: string, status: UserStatus): Promise<User> {
    // Start transaction
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await this.findById(userId);

      // Don't allow changing to ACTIVE if email isn't verified
      if (status === UserStatus.ACTIVE && !user.email_verified) {
        throw new BadRequestException(
          'Cannot activate account. Email not verified.',
        );
      }

      user.status = status;
      const updatedUser = await queryRunner.manager.save(user);

      await queryRunner.commitTransaction();
      return updatedUser;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async delete(id: string): Promise<void> {
    // Start transaction
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await this.findById(id);
      await queryRunner.manager.remove(user);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
