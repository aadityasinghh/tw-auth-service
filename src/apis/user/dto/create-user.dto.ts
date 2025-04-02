// // src/apis/user/dto/create-user.dto.ts
// import {
//   IsEmail,
//   IsNotEmpty,
//   IsString,
//   MinLength,
//   MaxLength,
//   Matches,
//   IsOptional,
// } from 'class-validator';

// export class CreateUserDto {
//   @IsNotEmpty()
//   @IsString()
//   @MaxLength(100)
//   firstName: string;

//   @IsNotEmpty()
//   @IsString()
//   @MaxLength(100)
//   lastName: string;

//   @IsNotEmpty()
//   @IsEmail()
//   email: string;

//   @IsNotEmpty()
//   @IsString()
//   @Matches(/^[0-9]{10}$/, { message: 'Phone number must be 10 digits' })
//   phone: string;

//   @IsNotEmpty()
//   @IsString()
//   @MinLength(8)
//   @Matches(
//     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
//     {
//       message:
//         'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character',
//     },
//   )
//   password: string;

//   @IsOptional()
//   @IsString()
//   @Matches(/^[0-9]{12}$/, { message: 'Aadhar number must be 12 digits' })
//   aadharNumber?: string;

//   @IsOptional()
//   @IsString()
//   profilePicture?: string;
// }
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
