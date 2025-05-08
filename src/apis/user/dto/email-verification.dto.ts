import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class RegisterUserDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    //   @IsString()
    //   @IsNotEmpty()
    //   @Matches(/^[0-9]{10}$/, {
    //     message: 'Phone number must be exactly 10 digits',
    //   })
    //   phone_number: string;

    @IsString()
    @IsNotEmpty()
    @Length(8)
    password: string;
}

export class VerifyEmailDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @Length(6, 6)
    otp: string;
}

export class ResendOtpDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
}
