import express from 'express';

import {
    getLeaves,
    getLeave,
    createLeave,
    deleteLeave,
    updateLeaveStatus
} from "../controllers/leave.controller.js"


const router = express.Router()

// GET all leaves
router.get('/', getLeaves)

// GET a single leave
router.get('/:id', getLeave)

// POST a new leave
router.post('/', createLeave)

// DELETE a leave
router.delete('/:id', deleteLeave)

// UPDATE a leave
router.patch('/:id', updateLeaveStatus)

export default router;