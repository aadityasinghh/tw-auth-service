import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { User } from '../../../apis/user/entities/user.entity';
import { ResponseService } from '../../common/services/response.service';
import { ResponseCodes } from '../../common/constants/response-messages.constant';

@Injectable()
export class VerifiedUserGuard implements CanActivate {
    constructor(private readonly responseService: ResponseService) {}

    async canActivate(context: ExecutionContext): Promise<boolean | never> {
        const request = context.switchToHttp().getRequest();
        const user = request.user as User | undefined;

        if (!user) {
            return this.responseService.unauthorized(
                'User not authenticated',
                ResponseCodes.UNAUTHORIZED,
            );
        }

        if (!user.email_verified) {
            return this.responseService.unauthorized(
                'Email not verified. Please verify your email before proceeding.',
                ResponseCodes.UNAUTHORIZED,
            );
        }

        return true;
    }
}
