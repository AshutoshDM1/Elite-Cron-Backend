import { Request, Response, NextFunction } from 'express';
import { AsyncHandler } from '../types';

/**
 * Wraps async route handlers to catch errors and pass them to Express error handler
 */
export const asyncHandler = (fn: AsyncHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
