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
  user_id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  phone_number: string;

  @Expose()
  status: UserStatus;

  @Expose()
  aadhar_number?: string;

  @Expose()
  aadhaar_verified?: AadharVerificationStatus;

  @Expose()
  profile_picture_url?: string;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

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
