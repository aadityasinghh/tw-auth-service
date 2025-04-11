import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from 'src/apis/user/entities/user.entity';

@Injectable()
export class VerifiedUserGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    if (!user.email_verified) {
      throw new UnauthorizedException(
        'Email not verified. Please verify your email before proceeding.',
      );
    }

    return true;
  }
}
