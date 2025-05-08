import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from 'src/apis/auth/auth.service';
import { User } from 'src/apis/user/entities/user.entity';
// import { AuthService } from '../auth.service';

type UserWithoutPassword = Omit<User, 'password'>;

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            usernameField: 'email',
        });
    }

    async validate(
        email: string,
        password: string,
    ): Promise<UserWithoutPassword> {
        return this.authService.validateUser(email, password);
    }
}
