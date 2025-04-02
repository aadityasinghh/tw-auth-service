// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class AuthService {}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../apis/user/user.service';
import * as bcrypt from 'bcrypt';
import { UserStatus } from '../../apis/user/entities/user.entity';
import { LoginUserDto } from '../../apis/user/dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email, true);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Account is inactive or blocked');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = user;
    return result;
  }

  login(user: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const payload = { email: user.email, sub: user.user_id };
    return {
      access_token: this.jwtService.sign(payload),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      user,
    };
  }

  async validateUserCredentials(loginUserDto: LoginUserDto) {
    return this.validateUser(loginUserDto.email, loginUserDto.password);
  }
}
