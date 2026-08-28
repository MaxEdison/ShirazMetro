import { Router } from 'express';
import { getSchedule} from '../controllers/scheduleController.js';

const router = Router();

router.get('/calculate', getSchedule);

export default router;