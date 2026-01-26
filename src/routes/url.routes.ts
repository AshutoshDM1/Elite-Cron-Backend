import { Router } from 'express';
import createUrlController from '../controllers/url-controllers/create-url-controller';
import { validateSchema } from '../middleware/validate.middleware';
import { createUrlValidation } from '../controllers/url-controllers/validation';
import getUrlController from '../controllers/url-controllers/get-url-controller';

const router = Router();

router.post('/', validateSchema(createUrlValidation), createUrlController);
router.get('/', getUrlController);

export default router;
