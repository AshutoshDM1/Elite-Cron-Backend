import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the Elite Cron api/v1' });
});

export default router;