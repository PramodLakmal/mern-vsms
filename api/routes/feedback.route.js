import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { create } from '../controllers/feedback.controller.js';
import { getFeedbacks } from '../controllers/feedback.controller.js';


const router = express.Router();

router.post(/create/, verifyToken, create);
router.get('/getfeedbacks', getFeedbacks);

export default router;