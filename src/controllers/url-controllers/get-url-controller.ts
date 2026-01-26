import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler";
import { prisma } from "../../lib/prisma";
import APIResponseType from "../../types/response.type";

const getUrlController = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const urlData = await prisma.url.findMany();

    res.status(200).json({
        success: true,
        message: 'URL found successfully',
        data: urlData,
        statusCode: 200
    } as APIResponseType);
});
export default getUrlController;