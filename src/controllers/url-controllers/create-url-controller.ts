import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler";
import { prisma } from "../../lib/prisma";
import APIResponseType from "../../types/response.type";

const createUrlController = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { url } = req.body;
    if (!url) {
        throw new Error('URL is required');
    }
    const shortUrl = await prisma.url.create({ data: { url } });
    res.status(201).json({
        success: true,
        message: 'URL created successfully',
        data: shortUrl,
        statusCode: 201
    } as APIResponseType);
});
export default createUrlController;