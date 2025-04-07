import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserStatus } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    const data = await this.userRepository.find();
    return data;
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

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if email exists
    const emailExists = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (emailExists) {
      throw new ConflictException('Email already exists');
    }

    // Check if phone exists
    const phoneExists = await this.userRepository.findOne({
      where: { phone_number: createUserDto.phone_number },
    });
    if (phoneExists) {
      throw new ConflictException('Phone number already exists');
    }

    // Check if Aadhaar exists
    if (createUserDto.aadhaar_number) {
      const aadhaarExists = await this.userRepository.findOne({
        where: { aadhaar_number: createUserDto.aadhaar_number },
      });
      if (aadhaarExists) {
        throw new ConflictException('Aadhaar number already exists');
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    // Create new user
    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      phone_number: createUserDto.phone_number,
      status: UserStatus.ACTIVE,
    });

    return this.userRepository.save(newUser);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);

    // Check if email exists
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const emailExists = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });
      if (emailExists) {
        throw new ConflictException('Email already exists');
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

    if (!user.aadhaar_number) {
      throw new BadRequestException('Aadhaar number not provided');
    }

    // In a real application, you would call an external Aadhaar verification service here
    user.aadhaar_verified = true;
    return this.userRepository.save(user);
  }

  async changeStatus(userId: string, status: UserStatus): Promise<User> {
    const user = await this.findById(userId);
    user.status = status;
    return this.userRepository.save(user);
  }

  async delete(id: string): Promise<void> {
    const user = await this.findById(id);
    await this.userRepository.remove(user);
  }
}
