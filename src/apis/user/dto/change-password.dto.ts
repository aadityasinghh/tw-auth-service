import { IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';

export class ChangePasswordDto {
    @IsString()
    @IsNotEmpty()
    currentPassword: string;

    @IsString()
    @MinLength(8)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message:
            'Password is too weak. It should include uppercase, lowercase, and numbers.',
    })
    newPassword: string;

    @IsString()
    @IsNotEmpty()
    confirmNewPassword: string;
}
