import express from 'express';
import {
    getNotices,
    getNotice,
    createNotice,
    deleteNotice,
    updateNotice
} from "../controllers/notice.controller.js"; // Import the appropriate controller functions

const router = express.Router();

// GET all notices
router.get('/', getNotices);

// GET a single notice
router.get('/:id', getNotice);

// POST a new notice
router.post('/', createNotice);

// DELETE a notice
router.delete('/:id', deleteNotice);

// UPDATE a notice
router.patch('/:id', updateNotice);

export default router;
