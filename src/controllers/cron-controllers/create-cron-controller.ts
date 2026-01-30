import { NextFunction, Request, Response } from 'express';
import { asyncHandler } from '../../utils/async-handler';
import { prisma } from '../../lib/prisma';
import APIResponseType from '../../types/response.type';

const createCronController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { interval } = req.body;

    const newCron = await prisma.cron.create({ data: { interval } });
    res.status(201).json({
      success: true,
      message: 'Cron created successfully',
      data: newCron,
      statusCode: 201,
    } as APIResponseType);
  }
);
export default createCronController;
