import { Router } from 'express';
import { deleteUrl } from '../../controllers/url-controllers/url.controllers';
import { validateParams } from '../../middleware/validate.middleware';
import { idParamSchema } from '../../validators';

const router = Router();

/**
 * @route   DELETE /api/v1/urls/:id
 * @desc    Delete URL by ID
 * @access  Public
 */
router.delete('/:id', validateParams(idParamSchema), deleteUrl);

export default router;
