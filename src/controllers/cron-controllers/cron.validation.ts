import { z } from 'zod';

const createCronValidation = z.object({
  interval: z.string().min(1).max(100),
  url: z.string().url().min(1).max(100),
});

const deleteCronValidationById = z.object({
  id: z.string().uuid(),
});

const getCronValidationById = z.object({
  id: z.string().uuid(),
});

export type CreateCronInput = z.infer<typeof createCronValidation>;
export type DeleteCronInputById = z.infer<typeof deleteCronValidationById>;
export type GetCronInputById = z.infer<typeof getCronValidationById>;

export { createCronValidation, deleteCronValidationById, getCronValidationById };
