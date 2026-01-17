import { z } from 'zod';

// ============================================
// URL Validators
// ============================================

export const createUrlSchema = z.object({
  url: z.string().url({ message: 'Invalid URL format' }).min(1, { message: 'URL is required' }),
});

export const updateUrlSchema = z.object({
  url: z.string().url({ message: 'Invalid URL format' }).optional(),
});

export const idParamSchema = z.object({
  id: z.string().uuid({ message: 'Invalid ID format' }),
});

// ============================================
// Type Exports
// ============================================

export type CreateUrlInput = z.infer<typeof createUrlSchema>;
export type UpdateUrlInput = z.infer<typeof updateUrlSchema>;
export type IdParam = z.infer<typeof idParamSchema>;
