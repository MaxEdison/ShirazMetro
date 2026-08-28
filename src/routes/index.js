import { Router } from 'express';

const router = Router();

router.use('/stations', stationRoutes);

export default router;