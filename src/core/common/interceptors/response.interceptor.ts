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

@Injectable()
export class ResponseInterceptor<T>
    implements NestInterceptor<T, ApiResponse<T>>
{
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<ApiResponse<T>> {
        return next.handle().pipe(
            map((data) => {
                // If the response is already in our format, return it as is
                if (
                    data &&
                    typeof data === 'object' &&
                    'data' in data &&
                    'message' in data &&
                    'code' in data
                ) {
                    return data;
                }

                // Otherwise, wrap it in our standard response format
                return {
                    data,
                    message: ResponseMessages.SUCCESS,
                    code: ResponseCodes.SUCCESS,
                };
            }),
        );
    }
}
