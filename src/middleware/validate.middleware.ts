import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ApiResponseHandler } from '../utils/api-response';

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      const errorMessage = error.errors?.[0]?.message || 'Validation failed';
      return ApiResponseHandler.badRequest(res, 'Validation error', errorMessage);
    }
  };
};

export const validateParams = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.params);
      next();
    } catch (error: any) {
      const errorMessage = error.errors?.[0]?.message || 'Validation failed';
      return ApiResponseHandler.badRequest(res, 'Invalid parameter', errorMessage);
    }
  };
};
