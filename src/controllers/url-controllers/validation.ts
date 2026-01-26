import { z } from "zod";

const createUrlValidation = z.object({
    url: z.string().url().min(1).max(2048),
});

const getUrlValidationById = z.object({
    id: z.string().uuid().min(1).max(2048),
    url: z.string().url().min(1).max(2048),
});

export type CreateUrlInput = z.infer<typeof createUrlValidation>;
export type GetUrlInputById = z.infer<typeof getUrlValidationById>;

export { createUrlValidation, getUrlValidationById };
