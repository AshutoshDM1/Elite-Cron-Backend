import { Router } from 'express';
import createUrlController from '../controllers/url-controllers/create-url-controller';
import { validateSchema } from '../middleware/validate.middleware';
import { createUrlValidation, getUrlValidationById } from '../controllers/url-controllers/validation';
import getUrlController from '../controllers/url-controllers/get-url-controller';
import getUrlControllerById from '../controllers/url-controllers/get-url-by-id-controller';

const router = Router();

router.post('/', validateSchema(createUrlValidation), createUrlController);
router.get('/', getUrlController);
router.get('/:id/:url', validateSchema(getUrlValidationById), getUrlControllerById);

export default router;
