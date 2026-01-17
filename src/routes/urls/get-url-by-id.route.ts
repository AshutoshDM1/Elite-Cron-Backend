import { Router } from 'express';
import { getUrlById } from '../../controllers/url-controllers/url.controllers';
import { validateParams } from '../../middleware/validate.middleware';
import { idParamSchema } from '../../validators';

const router = Router();

/**
 * @route   GET /api/v1/urls/:id
 * @desc    Get single URL by ID
 * @access  Public
 */
router.get('/:id', validateParams(idParamSchema), getUrlById);

export default router;
