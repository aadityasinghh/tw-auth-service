// src/apis/user/dto/user-response.dto.ts
import { Exclude, Expose } from 'class-transformer';
import {
  User,
  UserRole,
  UserStatus,
  AadharVerificationStatus,
} from '../entities/user.entity';

@Exclude()
export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  email: string;

  @Expose()
  phone: string;

  @Expose()
  role: UserRole;

  @Expose()
  status: UserStatus;

  @Expose()
  aadharNumber?: string;

  @Expose()
  aadharVerificationStatus?: AadharVerificationStatus;

  @Expose()
  profilePicture?: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  lastLogin?: Date;

  @Expose()
  isEmailVerified: boolean;

  @Expose()
  isPhoneVerified: boolean;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
