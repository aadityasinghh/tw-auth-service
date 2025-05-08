import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection, DataSource } from 'typeorm';
import { User, UserStatus } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { VerificationToken } from './entities/verificiation-token.entity';
import { NotificationService } from '../notification/notification.service';
import { RegisterUserDto } from './dto/email-verification.dto';
import { VerifyEmailDto } from './dto/email-verification.dto';
import { ResendOtpDto } from './dto/email-verification.dto';
import { ResponseService } from '../../core/common/services/response.service';
import {
  ResponseMessages,
  ResponseCodes,
} from '../../core/common/constants/response-messages.constant';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(VerificationToken)
    private tokenRepository: Repository<VerificationToken>,
    private readonly notificationService: NotificationService,
    private connection: DataSource,
    private readonly responseService: ResponseService,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { user_id: id },
    });

    if (!user) {
      return this.responseService.notFound('User', `with ID ${id}`);
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

  async getUserEmail(id: string): Promise<{ email: string }> {
    const user = await this.userRepository.findOne({
      where: { user_id: id },
      select: ['email'],
    });

    if (!user) {
      return this.responseService.notFound('User', `with ID ${id}`);
    }

    return { email: user.email };
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
        return this.responseService.conflict(
          ResponseMessages.EMAIL_EXISTS,
          ResponseCodes.EMAIL_EXISTS,
        );
        // await queryRunner.rollbackTransaction();
      } else if (emailExists && !emailExists.email_verified) {
        // If user exists but email not verified, resend verification
        await queryRunner.commitTransaction();
        await this.sendVerificationOtp(registerUserDto.email);
        return;
      }

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
      return this.responseService.notFound('User', `with email ${email}`);
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
      return this.responseService.badRequest(
        ResponseMessages.EMAIL_VERIFICATION_FAILED,
        ResponseCodes.EMAIL_VERIFICATION_FAILED,
      );
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
        await queryRunner.rollbackTransaction();
        return this.responseService.notFound('User', `with email ${email}`);
      }

      if (user.email_verified) {
        await queryRunner.rollbackTransaction();
        return this.responseService.badRequest(
          ResponseMessages.EMAIL_ALREADY_VERIFIED,
          ResponseCodes.EMAIL_ALREADY_VERIFIED,
        );
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
        await queryRunner.rollbackTransaction();
        return this.responseService.unauthorized(
          ResponseMessages.OTP_INVALID,
          ResponseCodes.OTP_INVALID,
        );
      }

      // Check if token is expired
      if (new Date() > verificationToken.expires_at) {
        await queryRunner.rollbackTransaction();
        return this.responseService.unauthorized(
          ResponseMessages.OTP_EXPIRED,
          ResponseCodes.OTP_EXPIRED,
        );
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
  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    user_id: string,
  ): Promise<User> {
    // Block email updates completely
    if (user_id !== id) {
      return this.responseService.unauthorized(
        ResponseMessages.UNAUTHORIZED_UPDATE,
        ResponseCodes.UNAUTHORIZED_UPDATE,
      );
    }
    if (updateUserDto.email) {
      return this.responseService.badRequest(
        ResponseMessages.EMAIL_CANNOT_BE_UPDATED,
        ResponseCodes.EMAIL_CANNOT_BE_UPDATED,
      );
    }

    // Start transaction
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    // console.log('id', id);
    try {
      const user = await this.findById(id);
      console.log('user', user);
      // Check if user is verified before allowing updates
      if (user.status === UserStatus.PENDING) {
        // await queryRunner.rollbackTransaction();
        return this.responseService.badRequest(
          ResponseMessages.ACCOUNT_NOT_VERIFIED,
          ResponseCodes.ACCOUNT_NOT_VERIFIED,
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
          // await queryRunner.rollbackTransaction();
          return this.responseService.conflict(
            ResponseMessages.PHONE_EXISTS,
            ResponseCodes.PHONE_EXISTS,
          );
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
          // await queryRunner.rollbackTransaction();
          return this.responseService.conflict(
            ResponseMessages.AADHAAR_EXISTS,
            ResponseCodes.AADHAAR_EXISTS,
          );
        }
      }

      // Hash password if provided
      // if (updateUserDto.password) {
      //   const salt = await bcrypt.genSalt();
      //   updateUserDto.password = await bcrypt.hash(
      //     updateUserDto.password,
      //     salt,
      //   );
      // }

      // Update user
      // const originalUser = user;
      Object.assign(user, {
        email: user.email,
        name: user.name,
        updateUserDto,
      });
      // look at this because we are not suppposed to get any getail after the user has updated the details we should get null but we are getting the other details whihch we dint updat
      const updatedUser = await queryRunner.manager.save(user);
      // console.log('updateduser', updatedUser);
      // console.log(originalUser.email, originalUser.name);
      await queryRunner.commitTransaction();
      // await this.notificationService.sendUserDetailsUpdateEmail(
      //   user.email,
      //   user.name,
      // );
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
        // await queryRunner.rollbackTransaction();
        return this.responseService.badRequest(
          ResponseMessages.ACCOUNT_NOT_VERIFIED,
          ResponseCodes.ACCOUNT_NOT_VERIFIED,
        );
      }

      if (!user.aadhaar_number) {
        // await queryRunner.rollbackTransaction();
        return this.responseService.badRequest(
          ResponseMessages.AADHAAR_NOT_PROVIDED,
          ResponseCodes.AADHAAR_NOT_PROVIDED,
        );
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
        // await queryRunner.rollbackTransaction();
        return this.responseService.badRequest(
          ResponseMessages.CANNOT_ACTIVATE_UNVERIFIED,
          ResponseCodes.CANNOT_ACTIVATE_UNVERIFIED,
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
