import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ApiResponse } from '../interfaces/api-response.interface';
import {
  ResponseCodes,
  ResponseMessages,
} from '../constants/response-messages.constant';

@Injectable()
export class ResponseService {
  /**
   * Creates a successful response object
   * @param data The data to return
   * @param message Optional message, defaults to "Operation successful"
   * @param code Optional code, defaults to "SUCCESS"
   * @returns Standardized API response
   */
  success<T>(
    data: T,
    message: string = ResponseMessages.SUCCESS,
    code: string = ResponseCodes.SUCCESS,
  ): ApiResponse<T> {
    return {
      data,
      message,
      code,
    };
  }

  /**
   * Creates an error response and throws it as an HttpException
   * @param message Error message
   * @param code Error code
   * @param status HTTP status code
   * @param data Optional data to include
   * @throws HttpException
   */
  error<T = null>(
    message: string,
    code: string,
    status: HttpStatus,
    data: T = null as T,
  ): never {
    throw new HttpException(
      {
        data,
        message,
        code,
      },
      status,
    );
  }

  /**
   * Handles not found errors
   * @param entity The entity that was not found (e.g., "User", "Product")
   * @param identifier Optional identifier that was used (e.g., "with ID 123")
   */
  notFound(entity: string, identifier?: string): never {
    const message = identifier
      ? `${entity} ${identifier} not found`
      : `${entity} not found`;

    return this.error(message, ResponseCodes.NOT_FOUND, HttpStatus.NOT_FOUND);
  }

  /**
   * Handles bad request errors
   * @param message Error message
   * @param code Error code, defaults to BAD_REQUEST
   */
  badRequest(
    message: string = ResponseMessages.BAD_REQUEST,
    code: string = ResponseCodes.BAD_REQUEST,
  ): never {
    return this.error(message, code, HttpStatus.BAD_REQUEST);
  }

  /**
   * Handles unauthorized errors
   * @param message Error message
   * @param code Error code, defaults to UNAUTHORIZED
   */
  unauthorized(
    message: string = ResponseMessages.UNAUTHORIZED,
    code: string = ResponseCodes.UNAUTHORIZED,
  ): never {
    return this.error(message, code, HttpStatus.UNAUTHORIZED);
  }

  /**
   * Handles conflict errors
   * @param message Error message
   * @param code Error code, defaults to CONFLICT
   */
  conflict(
    message: string = ResponseMessages.CONFLICT,
    code: string = ResponseCodes.CONFLICT,
  ): never {
    return this.error(message, code, HttpStatus.CONFLICT);
  }
}
