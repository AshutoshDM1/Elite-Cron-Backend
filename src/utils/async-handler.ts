import { Request, Response, NextFunction } from 'express';
import APIResponseType from '../types/response.type';

export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error); // Log the error
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error',
        statusCode: 500
      } as APIResponseType );
    }
  };