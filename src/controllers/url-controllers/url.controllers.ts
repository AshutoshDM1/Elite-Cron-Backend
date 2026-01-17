import { Request, Response } from 'express';
import prisma from '../../config/prisma';
import { asyncHandler } from '../../utils/async-handler';
import { ApiResponseHandler } from '../../utils/api-response';

/**
 * @desc    Get all URLs
 * @route   GET /api/v1/urls
 * @access  Public
 */
export const getAllUrls = asyncHandler(async (req: Request, res: Response) => {
  const urls = await prisma.url.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  ApiResponseHandler.success(res, 'URLs retrieved successfully', urls);
});

/**
 * @desc    Get single URL by ID
 * @route   GET /api/v1/urls/:id
 * @access  Public
 */
export const getUrlById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const url = await prisma.url.findUnique({
    where: { id },
  });

  if (!url) {
    ApiResponseHandler.notFound(res, 'URL');
    return;
  }

  ApiResponseHandler.success(res, 'URL retrieved successfully', url);
});

/**
 * @desc    Create new URL
 * @route   POST /api/v1/urls
 * @access  Public
 */
export const createUrl = asyncHandler(async (req: Request, res: Response) => {
  const { url } = req.body;

  const newUrl = await prisma.url.create({
    data: {
      url,
    },
  });

  ApiResponseHandler.created(res, 'URL created successfully', newUrl);
});

/**
 * @desc    Update URL by ID
 * @route   PUT /api/v1/urls/:id
 * @access  Public
 */
export const updateUrl = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { url } = req.body;

  // Check if URL exists
  const existingUrl = await prisma.url.findUnique({
    where: { id },
  });

  if (!existingUrl) {
    ApiResponseHandler.notFound(res, 'URL');
    return;
  }

  // Update URL
  const updatedUrl = await prisma.url.update({
    where: { id },
    data: {
      url,
    },
  });

  ApiResponseHandler.success(res, 'URL updated successfully', updatedUrl);
});

/**
 * @desc    Delete URL by ID
 * @route   DELETE /api/v1/urls/:id
 * @access  Public
 */
export const deleteUrl = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Check if URL exists
  const existingUrl = await prisma.url.findUnique({
    where: { id },
  });

  if (!existingUrl) {
    ApiResponseHandler.notFound(res, 'URL');
    return;
  }

  // Delete URL
  await prisma.url.delete({
    where: { id },
  });

  ApiResponseHandler.success(res, 'URL deleted successfully', { id });
});
