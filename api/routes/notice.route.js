import express from 'express';
import { createNotice, getAllNotices, getNoticeById, deleteNoticeById, updateNoticeById } from '../controllers/notice.controller.js';

const router = express.Router();

// Route to create a new notice
router.post('/create', createNotice);

// Route to get all notices
router.get('/all', getAllNotices);

// Route to get a single notice by ID
router.get('/:id', getNoticeById);

// Route to delete a notice by ID
router.delete('/:id', deleteNoticeById);

// Route to update a notice by ID
router.put('/update/:id', updateNoticeById);

export default router;
