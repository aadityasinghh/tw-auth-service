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
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiResponse } from '../../core/common/dto/api-response.dto';
import { User, UserStatus } from './entities/user.entity';
import { JwtAuthGuard } from '../../core/auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../core/auth/decorators/current-user.decorator';
import { UserResponseDto } from './dto/user-response.dto';
import { plainToClass } from 'class-transformer';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ApiResponse<UserResponseDto>> {
    const user = await this.userService.create(createUserDto);
    return ApiResponse.success(
      plainToClass(UserResponseDto, user),
      'User created successfully',
      HttpStatus.CREATED,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<ApiResponse<UserResponseDto[]>> {
    const users = await this.userService.findAll();
    return ApiResponse.success(
      users.map((user) => plainToClass(UserResponseDto, user)),
      'Users retrieved successfully',
    );
  }

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @Get('profile/me')
  getProfile(@CurrentUser() user: User): ApiResponse<UserResponseDto> {
    return ApiResponse.success(
      plainToClass(UserResponseDto, user),
      'Profile retrieved successfully',
    );
  }

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.userService.delete(id);
  }
}
