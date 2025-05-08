import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ResponseCodes } from '../constants/response-messages.constant';
import { ApiResponse } from '../interfaces/api-response.interface';

interface ErrorResponse {
    message: string | string[];
    code: string;
    data: null;
}

type HttpExceptionResponse = {
    message: string | string[];
    statusCode?: number;
    error?: string;
    code?: string;
};

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let responseBody: ErrorResponse = {
            data: null,
            message: 'Internal server error',
            code: ResponseCodes.FAILED,
        };

        // Handle HttpExceptions (including our custom ones)
        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const exceptionResponse =
                exception.getResponse() as HttpExceptionResponse;

            // Check if this is our custom format
            if (
                typeof exceptionResponse === 'object' &&
                exceptionResponse !== null &&
                'message' in exceptionResponse &&
                'code' in exceptionResponse
            ) {
                responseBody = {
                    data: null,
                    message: exceptionResponse.message,
                    code: exceptionResponse.code || '',
                };
            } else {
                // NestJS's standard HttpException
                responseBody.message =
                    typeof exceptionResponse === 'object'
                        ? exceptionResponse.message || 'An error occurred'
                        : String(exceptionResponse);

                // Set appropriate code based on status
                switch (status) {
                    case HttpStatus.NOT_FOUND:
                        responseBody.code = ResponseCodes.NOT_FOUND;
                        break;
                    case HttpStatus.BAD_REQUEST:
                        responseBody.code = ResponseCodes.BAD_REQUEST;
                        break;
                    case HttpStatus.UNAUTHORIZED:
                        responseBody.code = ResponseCodes.UNAUTHORIZED;
                        break;
                    case HttpStatus.CONFLICT:
                        responseBody.code = ResponseCodes.CONFLICT;
                        break;
                }
            }
        } else if (exception instanceof Error) {
            // Handle standard JS errors
            responseBody.message = exception.message;
        }

        response.status(status).json(responseBody);
    }
}
