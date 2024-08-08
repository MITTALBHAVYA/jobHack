// routes/statsRouter.js
import express from 'express';
import { getCounts } from '../controllers/statsController.js';

const router = express.Router();

router.get('/counts', getCounts);

export default router;
