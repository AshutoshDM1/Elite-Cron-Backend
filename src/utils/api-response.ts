import { Response } from 'express';
import { ApiResponse } from '../types';

export class ApiResponseHandler {
  static success<T>(res: Response, message: string, data?: T, statusCode: number = 200) {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data,
    };
    return res.status(statusCode).json(response);
  }

  static error(res: Response, message: string, error?: string, statusCode: number = 500) {
    const response: ApiResponse = {
      success: false,
      message,
      error,
    };
    return res.status(statusCode).json(response);
  }

  static notFound(res: Response, resource: string = 'Resource') {
    return this.error(res, `${resource} not found`, undefined, 404);
  }

  static badRequest(res: Response, message: string, error?: string) {
    return this.error(res, message, error, 400);
  }

  static created<T>(res: Response, message: string, data?: T) {
    return this.success(res, message, data, 201);
  }
}
