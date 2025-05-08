import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ResponseCodes } from '../constants/response-messages.constant';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let responseBody: any = {
            data: null,
            message: 'Internal server error',
            code: ResponseCodes.FAILED,
        };

        // Handle HttpExceptions (including our custom ones)
        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();

            // Check if this is our custom format
            if (
                typeof exceptionResponse === 'object' &&
                exceptionResponse !== null &&
                'message' in exceptionResponse &&
                'code' in exceptionResponse
            ) {
                responseBody = exceptionResponse;
            } else {
                // NestJS's standard HttpException
                responseBody.message =
                    typeof exceptionResponse === 'object'
                        ? (exceptionResponse as any).message ||
                          'An error occurred'
                        : exceptionResponse;

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
