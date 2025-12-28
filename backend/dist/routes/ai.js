import express from 'express';
const router = express.Router();
import { generateOutreachController } from '../controllers/aiController.js';
router.post('/outreach/generate', generateOutreachController);
export default router;
