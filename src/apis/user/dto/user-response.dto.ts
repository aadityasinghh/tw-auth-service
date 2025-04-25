// src/apis/user/dto/user-response.dto.ts
import { Exclude, Expose } from 'class-transformer';
import { UserStatus } from '../entities/user.entity';

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
  aadhaar_number: string;

  @Expose()
  aadhaar_verified: boolean;

  @Expose()
  email_verified: boolean;

  @Expose()
  status: UserStatus;

  @Expose()
  profile_picture_url: string;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;
}
