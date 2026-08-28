import { Router } from 'express';
import stationRoutes from './stationRoutes.js';
import scheduleRoutes from './scheduleRoutes.js';

const router = Router();

router.use('/stations', stationRoutes);
router.use('/schedules', scheduleRoutes);

export default router;