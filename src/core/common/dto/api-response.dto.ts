// // src/core/common/dto/api-response.dto.ts
// export enum ResponseStatus {
//   SUCCESS = 'success',
//   ERROR = 'error',
// }

// export enum ResponseCode {
//   // Success codes
//   SUCCESS = '200',
//   CREATED = '201',
//   NO_CONTENT = '204',

//   // Error codes
//   BAD_REQUEST = '400',
//   UNAUTHORIZED = '401',
//   FORBIDDEN = '403',
//   NOT_FOUND = '404',
//   CONFLICT = '409',
//   INTERNAL_SERVER_ERROR = '500',
//   SERVICE_UNAVAILABLE = '503',
// }

// export class ApiResponse<T = any> {
//   status: ResponseStatus;
//   code: ResponseCode;
//   message: string;
//   data?: T;
//   timestamp: string;

//   constructor(
//     status: ResponseStatus,
//     code: ResponseCode,
//     message: string,
//     data?: T,
//   ) {
//     this.status = status;
//     this.code = code;
//     this.message = message;
//     this.data = data;
//     this.timestamp = new Date().toISOString();
//   }

//   static success<T>(
//     message: string,
//     data?: T,
//     code: ResponseCode = ResponseCode.SUCCESS,
//   ): ApiResponse<T> {
//     return new ApiResponse(ResponseStatus.SUCCESS, code, message, data);
//   }

//   static error<T>(
//     message: string,
//     code: ResponseCode = ResponseCode.INTERNAL_SERVER_ERROR,
//     data?: T,
//   ): ApiResponse<T> {
//     return new ApiResponse(ResponseStatus.ERROR, code, message, data);
//   }
// }

import { HttpStatus } from '@nestjs/common';

export class ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
  statusCode: HttpStatus;

  constructor(options: {
    success: boolean;
    message: string;
    data?: T;
    error?: Error;
    statusCode: HttpStatus;
  }) {
    this.success = options.success;
    this.message = options.message;
    this.data = options.data;
    this.error = options.error;
    this.statusCode = options.statusCode;
  }

  static success<T>(
    data?: T,
    message = 'Operation successful',
    statusCode = HttpStatus.OK,
  ): ApiResponse<T> {
    return new ApiResponse<T>({
      success: true,
      message,
      data,
      statusCode,
    });
  }

  static error<T>(
    message = 'Operation failed',
    error?: Error,
    statusCode = HttpStatus.BAD_REQUEST,
  ): ApiResponse<T> {
    return new ApiResponse<T>({
      success: false,
      message,
      error,
      statusCode,
    });
  }
}
