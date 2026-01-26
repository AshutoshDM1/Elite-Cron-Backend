import { ZodError, ZodSchema } from "zod";
import { NextFunction, Request, Response } from "express";

export const validateSchema = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            // Validate request body
            if (schema && req.body) {
                req.body = schema.parse(req.body);
            }
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: error.issues.map((err: any) => ({
                        path: err.path.join('.'),
                        message: err.message,
                        code: err.code,
                    })),
                });
                return;
            }

            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    };
};
