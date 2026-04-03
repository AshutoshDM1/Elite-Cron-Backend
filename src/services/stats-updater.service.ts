import { prisma } from '../lib/prisma';
import { UrlCheckResult } from './url-checker.service';

/**
 * Calculate time difference between two dates in seconds
 */
function calculateTimeDifferenceInSeconds(from: Date, to: Date): number {
  return Math.floor((to.getTime() - from.getTime()) / 1000);
}

/**
 * Update URL statistics after a check
 */
export async function updateUrlStatistics(
  urlId: string,
  result: UrlCheckResult
): Promise<void> {
  try {
    // Fetch current URL data
    const urlData = await prisma.url.findUnique({
      where: { id: urlId },
      select: {
        status: true,
        lastCheckedAt: true,
        totalUpTime: true,
        totalDownTime: true,
        averageResponseTime: true,
        totalChecks: true,
      },
    });

    if (!urlData) {
      return;
    }

    const now = new Date();
    let additionalUpTime = 0;
    let additionalDownTime = 0;

    // Calculate uptime/downtime since last check
    if (urlData.lastCheckedAt) {
      const secondsSinceLastCheck = calculateTimeDifferenceInSeconds(
        urlData.lastCheckedAt,
        now
      );

      // Add time to uptime or downtime based on PREVIOUS status
      if (urlData.status === 'UP') {
        additionalUpTime = secondsSinceLastCheck;
      } else if (urlData.status === 'DOWN' || urlData.status === 'ERROR') {
        additionalDownTime = secondsSinceLastCheck;
      }
    }

    // Calculate new average response time (only for successful checks)
    let newAverageResponseTime = urlData.averageResponseTime;
    if (result.status === 'UP' && result.responseTime !== undefined) {
      const totalChecks = urlData.totalChecks;
      if (totalChecks === 0) {
        newAverageResponseTime = result.responseTime;
      } else {
        // Rolling average: (oldAvg * count + newValue) / (count + 1)
        newAverageResponseTime =
          (urlData.averageResponseTime * totalChecks + result.responseTime) /
          (totalChecks + 1);
      }
    }

    // Update URL with new statistics
    await prisma.url.update({
      where: { id: urlId },
      data: {
        status: result.status,
        lastStatus: urlData.status, // Store previous status
        lastCheckedAt: now,
        totalUpTime: urlData.totalUpTime + additionalUpTime,
        totalDownTime: urlData.totalDownTime + additionalDownTime,
        averageResponseTime: newAverageResponseTime,
        totalChecks: urlData.totalChecks + 1,
        updatedAt: now,
      },
    });
  } catch (error) {
    console.error(`[Stats Updater] Error updating statistics for URL ${urlId}:`, error);
    throw error;
  }
}

/**
 * Get URL statistics summary
 */
export async function getUrlStatistics(urlId: string) {
  const urlData = await prisma.url.findUnique({
    where: { id: urlId },
    select: {
      status: true,
      totalUpTime: true,
      totalDownTime: true,
      averageResponseTime: true,
      totalChecks: true,
      lastCheckedAt: true,
    },
  });

  if (!urlData) {
    return null;
  }

  const totalTime = urlData.totalUpTime + urlData.totalDownTime;
  const uptimePercentage = totalTime > 0 
    ? (urlData.totalUpTime / totalTime) * 100 
    : 0;

  return {
    ...urlData,
    uptimePercentage: parseFloat(uptimePercentage.toFixed(2)),
    totalUpTimeFormatted: formatSeconds(urlData.totalUpTime),
    totalDownTimeFormatted: formatSeconds(urlData.totalDownTime),
  };
}

/**
 * Format seconds into human-readable format
 */
function formatSeconds(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

  return parts.join(' ');
}
