import {
    IsEmail,
    IsOptional,
    IsString,
    MaxLength,
    Matches,
    IsEnum,
} from 'class-validator';
import { AadharVerificationStatus, UserStatus } from '../entities/user.entity';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    @MaxLength(100)
    name?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    @Matches(/^[0-9]{10}$/, { message: 'Phone number must be 10 digits' })
    phone_number?: string;

    @IsOptional()
    @IsString()
    @Matches(/^[0-9]{12}$/, { message: 'Aadhar number must be 12 digits' })
    aadhar_number?: string;

    @IsOptional()
    @IsEnum(AadharVerificationStatus)
    aadhaar_verified?: AadharVerificationStatus;

    @IsOptional()
    @IsString()
    profilePicture?: string;

    @IsOptional()
    @IsEnum(UserStatus)
    status?: UserStatus;

    // @IsOptional()
    // @IsString()
    // password?: string;
}
