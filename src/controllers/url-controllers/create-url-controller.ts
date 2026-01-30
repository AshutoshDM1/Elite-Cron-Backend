import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/async-handler';
import { prisma } from '../../lib/prisma';
import APIResponseType from '../../types/response.type';

const createUrlController = asyncHandler(
  async (req: Request, res: Response,): Promise<void> => {
    const { url, interval } = req.body;
    if (!url) {
      throw new Error('URL is required');
    }
    if (!interval) {
      throw new Error('Interval is required');
    }

    // Create cron and url together in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const newCron = await tx.cron.create({
        data: { interval },
      });

      const newUrl = await tx.url.create({
        data: {
          url,
          cronId: newCron.id,
        },
        include: {
          cron: true,
        },
      });

      return newUrl;
    });

    res.status(201).json({
      success: true,
      message: 'URL created successfully',
      data: result,
      statusCode: 201,
    } as APIResponseType);
  }
);
export default createUrlController;
