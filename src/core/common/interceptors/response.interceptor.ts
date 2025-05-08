import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
    ResponseCodes,
    ResponseMessages,
} from '../constants/response-messages.constant';
import { ApiResponse } from '../interfaces/api-response.interface';

interface ResponseFormatted {
    data: unknown;
    message: string;
    code: string;
}

@Injectable()
export class ResponseInterceptor<T>
    implements NestInterceptor<T, ApiResponse<T>>
{
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<ApiResponse<T>> {
        return next.handle().pipe(
            map((data: unknown): ApiResponse<T> => {
                // If the response is already in our format, return it as is
                if (this.isResponseFormatted(data)) {
                    return data as ApiResponse<T>;
                }

                // Otherwise, wrap it in our standard response format
                return {
                    data: data as T,
                    message: ResponseMessages.SUCCESS,
                    code: ResponseCodes.SUCCESS,
                };
            }),
        );
    }

    private isResponseFormatted(data: unknown): data is ResponseFormatted {
        return (
            data !== null &&
            typeof data === 'object' &&
            'data' in data &&
            'message' in data &&
            'code' in data
        );
    }
}
