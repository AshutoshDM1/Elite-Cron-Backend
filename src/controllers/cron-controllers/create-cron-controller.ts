import { NextFunction, Request, Response } from 'express';
import { asyncHandler } from '../../utils/async-handler';
import { prisma } from '../../lib/prisma';
import APIResponseType from '../../types/response.type';
import { scheduleCronJobById } from '../../services/cron-scheduler.service';

const createCronController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { interval } = req.body;
    const { url } = req.body;
    const username = (req as any).username as string | undefined;

    const user = username
      ? await prisma.user.findUnique({ where: { username } })
      : null;

    if (!user) {
      res.status(403).json({
        success: false,
        message: 'Invalid username. User not found.',
        data: null,
        statusCode: 403,
      } as APIResponseType);
      return;
    }

    const newCron = await prisma.cron.create({
      data: {
        interval,
        user: { connect: { id: user.id } },
        url: { create: { url } },
      },
    });

    const scheduled = await scheduleCronJobById(newCron.id);
    if (!scheduled) {
      console.warn(
        `[Cron Scheduler] Cron created in DB but could not be scheduled (cronId=${newCron.id})`
      );
    }

    res.status(201).json({
      success: true,
      message: 'Cron created successfully',
      data: newCron,
      statusCode: 201,
    } as APIResponseType);
  }
);
export default createCronController;
