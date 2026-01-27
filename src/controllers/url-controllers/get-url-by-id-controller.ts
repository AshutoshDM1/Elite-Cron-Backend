import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler";
import { prisma } from "../../lib/prisma";
import APIResponseType from "../../types/response.type";

const getUrlControllerById = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id , url } = req.params;
    
    const urlData = await prisma.url.findUnique({
        where: {
            id: id,
            url: url
        }
    });

    res.status(200).json({
        success: true,
        message: 'Single URL found successfully',
        data: urlData,
        statusCode: 200
    } as APIResponseType);
});
export default getUrlControllerById;