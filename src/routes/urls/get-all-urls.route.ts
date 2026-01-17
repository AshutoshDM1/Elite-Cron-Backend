import { Router } from 'express';
import { getAllUrls } from '../../controllers/url-controllers/url.controllers';

const router = Router();

/**
 * @route   GET /api/v1/urls
 * @desc    Get all URLs
 * @access  Public
 */
router.get('/', getAllUrls);

export default router;
