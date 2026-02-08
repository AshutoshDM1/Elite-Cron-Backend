import { prisma } from '../../lib/prisma';

/**
 * Seed script for creating example cron + url records.
 *
 * Run with (from project root), for example:
 *   npx ts-node src/controllers/cron-controllers/cron-seed.ts
 */
export const seedCronAndUrls = async () => {
  try {
    // Clean existing data (order matters because of relations)
    await prisma.log.deleteMany();
    await prisma.url.deleteMany();
    await prisma.cron.deleteMany();

    // Example seed data
    const cronData = [
      {
        interval: '*/1 * * * *', // every 1 minute (for testing)
        url: 'https://www.google.com',
      },
      {
        interval: '*/2 * * * *', // every 2 minutes
        url: 'https://www.github.com',
      },
      {
        interval: '*/3 * * * *', // every 3 minutes
        url: 'https://httpbin.org/status/200',
      },
    ];

    for (const item of cronData) {
      await prisma.cron.create({
        data: {
          interval: item.interval,
          url: {
            create: {
              url: item.url,
              // other url fields use their Prisma defaults
            },
          },
        },
      });
    }

    // eslint-disable-next-line no-console
    console.log('Cron and URL seed data created successfully.');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error seeding cron and url data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

// If this file is executed directly via ts-node, run the seed.
if (require.main === module) {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  seedCronAndUrls().then(() => {
    process.exit(0);
  }).catch(() => {
    process.exit(1);
  });
}

