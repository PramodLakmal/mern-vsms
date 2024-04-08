import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { create } from '../controllers/feedback.controller.js';
import { getFeedbacks } from '../controllers/feedback.controller.js';
import { editFeedbacks } from '../controllers/feedback.controller.js';
import { deleteFeedbacks } from '../controllers/feedback.controller.js';


const router = express.Router();

router.post(/create/, verifyToken, create);
router.get('/getfeedbacks', getFeedbacks);
router.put('/editfeedbacks/:feedbackId', verifyToken, editFeedbacks);
router.delete('/deletefeedbacks/:feedbackId', verifyToken, deleteFeedbacks);

export default router; 