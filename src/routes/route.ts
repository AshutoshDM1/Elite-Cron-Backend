import { Router } from 'express';
import cronRoutes from './cron.routes';

const router = Router();

router.use('/cron', cronRoutes);

router.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the Elite Cron api/v1' });
});

export default router;
