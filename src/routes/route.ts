import { Router } from 'express';
import urlRoutes from './url.routes';
import cronRoutes from './cron.routes';

const router = Router();

router.use('/url', urlRoutes);
router.use('/cron', cronRoutes);

router.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the Elite Cron api/v1' });
});

export default router;
