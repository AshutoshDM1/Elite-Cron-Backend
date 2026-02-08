import cron from 'node-cron';
import { prisma } from '../lib/prisma';
import { executeUrlCheck } from './url-checker.service';
import { updateUrlStatistics } from './stats-updater.service';

// Store scheduled tasks
const scheduledTasks: Map<string, cron.ScheduledTask> = new Map();

/**
 * Execute a single cron job: check URL and update statistics
 */
async function executeCronJob(cronId: string, urlId: string, urlString: string): Promise<void> {
  try {
    console.log(`[Cron Scheduler] Executing job for cron ${cronId} - ${urlString}`);

    // Check the URL and log result
    const result = await executeUrlCheck(urlId, urlString);

    // Update URL statistics
    await updateUrlStatistics(urlId, result);

    console.log(`[Cron Scheduler] Job completed for cron ${cronId} - Status: ${result.status}`);
  } catch (error) {
    console.error(`[Cron Scheduler] Error executing job for cron ${cronId}:`, error);
  }
}

/**
 * Schedule a single cron job
 */
function scheduleCronJob(
  cronId: string,
  urlId: string,
  urlString: string,
  interval: string
): boolean {
  try {
    // Validate cron expression
    if (!cron.validate(interval)) {
      console.error(`[Cron Scheduler] Invalid cron expression: ${interval} for cron ${cronId}`);
      return false;
    }

    // If task already exists, stop it first
    if (scheduledTasks.has(cronId)) {
      console.log(`[Cron Scheduler] Stopping existing task for cron ${cronId}`);
      const existingTask = scheduledTasks.get(cronId);
      existingTask?.stop();
      scheduledTasks.delete(cronId);
    }

    // Schedule the task
    const task = cron.schedule(
      interval,
      async () => {
        await executeCronJob(cronId, urlId, urlString);
      },
      {
        scheduled: true,
        timezone: 'UTC', // Use UTC timezone
      }
    );

    scheduledTasks.set(cronId, task);
    console.log(`[Cron Scheduler] Scheduled cron job ${cronId} with interval: ${interval}`);
    return true;
  } catch (error) {
    console.error(`[Cron Scheduler] Error scheduling cron job ${cronId}:`, error);
    return false;
  }
}

/**
 * Stop a scheduled cron job
 */
export function stopCronJob(cronId: string): boolean {
  const task = scheduledTasks.get(cronId);
  if (task) {
    task.stop();
    scheduledTasks.delete(cronId);
    console.log(`[Cron Scheduler] Stopped cron job ${cronId}`);
    return true;
  }
  return false;
}

/**
 * Initialize all cron jobs from database
 */
export async function initializeCronJobs(): Promise<void> {
  try {
    console.log('[Cron Scheduler] Initializing cron jobs...');

    // Fetch all cron jobs with their URLs
    const cronJobs = await prisma.cron.findMany({
      include: {
        url: true,
      },
    });

    console.log(`[Cron Scheduler] Found ${cronJobs.length} cron job(s) in database`);

    let scheduledCount = 0;

    // Schedule each cron job
    for (const cronJob of cronJobs) {
      if (!cronJob.url) {
        console.warn(`[Cron Scheduler] Cron ${cronJob.id} has no associated URL, skipping`);
        continue;
      }

      const success = scheduleCronJob(
        cronJob.id,
        cronJob.url.id,
        cronJob.url.url,
        cronJob.interval
      );

      if (success) {
        scheduledCount++;
      }
    }

    console.log(
      `[Cron Scheduler] Successfully scheduled ${scheduledCount} out of ${cronJobs.length} cron job(s)`
    );
  } catch (error) {
    console.error('[Cron Scheduler] Error initializing cron jobs:', error);
    throw error;
  }
}

/**
 * Stop all scheduled cron jobs
 */
export function stopAllCronJobs(): void {
  console.log(`[Cron Scheduler] Stopping all ${scheduledTasks.size} cron job(s)...`);
  
  scheduledTasks.forEach((task, cronId) => {
    task.stop();
    console.log(`[Cron Scheduler] Stopped cron job ${cronId}`);
  });
  
  scheduledTasks.clear();
  console.log('[Cron Scheduler] All cron jobs stopped');
}

/**
 * Get status of all scheduled jobs
 */
export function getScheduledJobsStatus(): Array<{
  cronId: string;
  isRunning: boolean;
}> {
  const status: Array<{ cronId: string; isRunning: boolean }> = [];
  
  scheduledTasks.forEach((task, cronId) => {
    status.push({
      cronId,
      isRunning: true, // If it's in the map, it's running
    });
  });
  
  return status;
}

/**
 * Reload cron jobs from database (useful after adding/updating/deleting crons)
 */
export async function reloadCronJobs(): Promise<void> {
  console.log('[Cron Scheduler] Reloading cron jobs...');
  stopAllCronJobs();
  await initializeCronJobs();
}
