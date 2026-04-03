import { Request, Response } from 'express';

export const getHealthController = (req: Request, res: Response) => {
  res.status(200).json({ message: 'API is running' });
};