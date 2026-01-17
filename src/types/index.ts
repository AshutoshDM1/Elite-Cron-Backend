import { Request, Response, NextFunction } from 'express';

export interface AsyncHandler {
  (req: Request, res: Response, next: NextFunction): Promise<void>;
}

export interface UrlCreateInput {
  url: string;
}

export interface UrlUpdateInput {
  url?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}
