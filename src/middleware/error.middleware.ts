import { Request, Response, NextFunction } from 'express';
import { ApiResponseHandler } from '../utils/api-response';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);

  // Prisma errors
  if (err.code === 'P2002') {
    return ApiResponseHandler.badRequest(res, 'Duplicate entry', 'A record with this value already exists');
  }

  if (err.code === 'P2025') {
    return ApiResponseHandler.notFound(res, 'Record');
  }

  // Default error
  const message = err.message || 'Internal server error';
  const statusCode = err.statusCode || 500;

  return ApiResponseHandler.error(res, message, err.stack, statusCode);
};

export const notFoundHandler = (req: Request, res: Response) => {
  return ApiResponseHandler.notFound(res, 'Route');
};
