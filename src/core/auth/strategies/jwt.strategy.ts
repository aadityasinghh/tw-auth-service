import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../../apis/user/user.service';
import { Request } from 'express';
import { User, UserStatus } from '../../../apis/user/entities/user.entity';
import { ResponseService } from '../../common/services/response.service';
import {
    ResponseCodes,
    ResponseMessages,
} from '../../common/constants/response-messages.constant';

interface JwtPayload {
    email: string;
    sub: string;
    iat?: number;
    exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        private readonly userService: UserService,
        private readonly responseService: ResponseService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                // First try to extract from cookie
                (request: Request) => {
                    const token = request?.cookies?.access_token;
                    if (!token) {
                        return null;
                    }
                    return token;
                },
                // Fallback to Authorization Bearer token
                ExtractJwt.fromAuthHeaderAsBearerToken(),
            ]),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>(
                'JWT_SECRET',
                'superSecretKey',
            ),
        });
    }

    async validate(payload: JwtPayload): Promise<User> {
        const user = await this.userService.findById(payload.sub);

        if (!user) {
            return this.responseService.unauthorized(
                ResponseMessages.USER_NOT_FOUND,
                ResponseCodes.USER_NOT_FOUND,
            );
        }

        if (user.status !== UserStatus.ACTIVE) {
            return this.responseService.unauthorized(
                ResponseMessages.ACCOUNT_INACTIVE,
                ResponseCodes.ACCOUNT_INACTIVE,
            );
        }

        return user;
    }
}
