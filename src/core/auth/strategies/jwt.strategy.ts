/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { ConfigService } from '@nestjs/config';
// import { UserService } from '../../../apis/user/user.service';
// import { UserStatus } from '../../../apis/user/entities/user.entity';

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor(
//     private configService: ConfigService,
//     private userService: UserService,
//   ) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false,
//       secretOrKey: configService.get<string>('JWT_SECRET', 'superSecretKey'),
//     });
//   }

//   async validate(payload: any) {
//     const user = await this.userService.findById(payload.sub);

//     if (!user) {
//       throw new UnauthorizedException('User not found');
//     }

//     if (user.status !== UserStatus.ACTIVE) {
//       throw new UnauthorizedException('Account is inactive or blocked');
//     }

//     return user;
//   }
// }

import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../../apis/user/user.service';
import { Request } from 'express';
import { UserStatus } from 'src/apis/user/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
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
      secretOrKey: configService.get<string>('JWT_SECRET', 'superSecretKey'),
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Account is inactive or blocked');
    }

    return user;
  }
}
