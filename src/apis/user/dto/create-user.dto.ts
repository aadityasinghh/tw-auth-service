import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password is too weak. It should include uppercase, lowercase, and numbers.',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[6-9]\d{9}$/, {
    message: 'Phone number should be a valid 10-digit Indian number',
  })
  phone_number: string;

  @IsString()
  @IsOptional()
  @Matches(/^\d{12}$/, {
    message: 'Aadhaar number should be a valid 12-digit number',
  })
  aadhaar_number?: string;
}
