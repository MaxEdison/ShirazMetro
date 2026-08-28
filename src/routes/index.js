import { Router } from 'express';

const router = Router();

router.use('/stations', stationRoutes);
router.use('/schedules', scheduleRoutes);

export default router;