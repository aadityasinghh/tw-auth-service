// // src/core/auth/auth.module.ts
// import { Module } from '@nestjs/common';
// import { JwtModule } from '@nestjs/jwt';
// import { PassportModule } from '@nestjs/passport';
// import { JwtStrategy } from './strategies/jwt.strategy';

// @Module({
//   imports: [
//     PassportModule,
//     JwtModule.register({
//       secret: process.env.JWT_ACCESS_SECRET || 'accessSecret',
//       signOptions: { expiresIn: '15m' },
//     }),
//   ],
//   providers: [JwtStrategy],
//   exports: [JwtModule],
// })
// export class AuthModule {}

// // src/core/auth/strategies/jwt.strategy.ts
// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { User } from '../../../apis/user/entities/user.entity';

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor(
//     @InjectRepository(User)
//     private userRepository: Repository<User>,
//   ) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false,
//       secretOrKey: process.env.JWT_ACCESS_SECRET || 'accessSecret',
//     });
//   }

//   async validate(payload: any) {
//     const user = await this.userRepository.findOne({
//       where: { id: payload.sub },
//     });

//     if (!user) {
//       throw new UnauthorizedException('User not found');
//     }

//     return { sub: payload.sub, email: payload.email, role: payload.role };
//   }
// }

// // src/core/auth/guards/jwt-auth.guard.ts
// import { Injectable } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';

// @Injectable()
// export class JwtAuthGuard extends AuthGuard('jwt') {}

// // src/core/auth/guards/roles.guard.ts
// import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { UserRole } from '../../../apis/user/entities/user.entity';

// @Injectable()
// export class RolesGuard implements CanActivate {
//   constructor(private reflector: Reflector) {}

//   canActivate(context: ExecutionContext): boolean {
//     const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
//       'roles',
//       [context.getHandler(), context.getClass()],
//     );

//     if (!requiredRoles) {
//       return true;
//     }

//     const { user } = context.switchToHttp().getRequest();
//     return requiredRoles.some((role) => user.role === role);
//   }
// }e

// // src/core/auth/decorators/roles.decorator.ts
// import { SetMetadata } from '@nestjs/common';
// import { UserRole } from '../../../apis/user/entities/user.entity';

// export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
