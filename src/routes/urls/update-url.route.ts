import { Router } from 'express';
import { updateUrl } from '../../controllers/url-controllers/url.controllers';
import { validateBody, validateParams } from '../../middleware/validate.middleware';
import { updateUrlSchema, idParamSchema } from '../../validators';

const router = Router();

/**
 * @route   PUT /api/v1/urls/:id
 * @desc    Update URL by ID
 * @access  Public
 */
router.put('/:id', validateParams(idParamSchema), validateBody(updateUrlSchema), updateUrl);

export default router;
