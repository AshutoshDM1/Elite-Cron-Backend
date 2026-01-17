import { Router } from 'express';
import { createUrl } from '../../controllers/url-controllers/url.controllers';
import { validateBody } from '../../middleware/validate.middleware';
import { createUrlSchema } from '../../validators';

const router = Router();

/**
 * @route   POST /api/v1/urls
 * @desc    Create new URL
 * @access  Public
 */
router.post('/', validateBody(createUrlSchema), createUrl);

export default router;
