import { Router } from 'express';
import { validateSchema } from '../middleware/validate.middleware';
import createCronController from '../controllers/cron-controllers/create-cron-controller';
import getCronController from '../controllers/cron-controllers/get-cron-controller';
import deleteCronController from '../controllers/cron-controllers/delete-cron-controller';
import {
  createCronValidation,
  deleteCronValidationById,
} from '../controllers/cron-controllers/cron.validation';

const router = Router();

router.post('/', validateSchema(createCronValidation), createCronController);
router.get('/', getCronController);
router.delete('/:id', validateSchema(deleteCronValidationById), deleteCronController);

export default router;
