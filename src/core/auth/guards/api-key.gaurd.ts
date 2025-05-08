// src/core/auth/guards/api-key.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ResponseService } from '../../common/services/response.service';
import {
    ResponseCodes,
    ResponseMessages,
} from '../../common/constants/response-messages.constant';

@Injectable()
export class ApiKeyGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private configService: ConfigService,
        private responseService: ResponseService,
    ) {}

    canActivate(context: ExecutionContext): boolean | never {
        const isApiKeyRequired = this.reflector.get<boolean>(
            'apiKey',
            context.getHandler(),
        );

        if (!isApiKeyRequired) {
            return true;
        }

        const request = context.switchToHttp().getRequest<Request>();
        const apiKey = request.headers['x-api-key'] as string | undefined;

        if (!apiKey) {
            return this.responseService.unauthorized(
                ResponseMessages.API_KEY_MISSING,
                ResponseCodes.API_KEY_MISSING,
            );
        }

        const validApiKey = this.configService.get<string>('API_KEY');

        if (!validApiKey) {
            // This is a server-side configuration error
            console.error('API_KEY is not configured in environment variables');
            return this.responseService.unauthorized(
                'Internal server error',
                ResponseCodes.UNAUTHORIZED,
            );
        }

        if (apiKey !== validApiKey) {
            return this.responseService.unauthorized(
                ResponseMessages.API_KEY_INVALID,
                ResponseCodes.API_KEY_INVALID,
            );
        }

        return true;
    }
}
