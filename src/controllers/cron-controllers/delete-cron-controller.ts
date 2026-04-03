import { NextFunction, Request, Response } from 'express';
import { asyncHandler } from '../../utils/async-handler';
import { prisma } from '../../lib/prisma';
import APIResponseType from '../../types/response.type';
import { stopCronJob } from '../../services/cron-scheduler.service';

const deleteCronController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;

    const cronBeforeDelete = await prisma.cron.findUnique({
      where: { id },
      include: { url: true },
    });

    const deletedCron = await prisma.cron.delete({
      where: {
        id: id,
      },
    });

    const stopped = stopCronJob(id);
    if (!stopped) {
      console.warn(
        `[Cron Scheduler] Cron deleted in DB but was not running in-memory (cronId=${id})`
      );
    }

    if (cronBeforeDelete?.url?.url) {
      console.log('\n=== Cron Scheduler ===');
      console.table([
        {
          url: cronBeforeDelete.url.url,
          state: 'DELETED',
        },
      ]);
    }

    res.status(200).json({
      success: true,
      message: 'Cron deleted successfully',
      data: deletedCron,
      statusCode: 200,
    } as APIResponseType);
  }
);
export default deleteCronController;
