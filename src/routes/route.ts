import { Router } from 'express';
import cronRoutes from './cron.routes';
import { getHealthController } from '../controllers/health-controllers/get-health-controller';

const router = Router();

router.use('/cron', cronRoutes);
router.get('/health', getHealthController);

export default router;
