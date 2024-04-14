import express from 'express';

import {
    getSalaries,
    getSalary,
    createSalary,
    deleteSalary,
    updateSalary,
    generateSalaryReport
} from "../controllers/salary.controller.js"


const router = express.Router()

// GET all salaries
router.get('/', getSalaries)

// GET a single salary
router.get('/:id', getSalary)

// POST a new salary
router.post('/', createSalary)

// DELETE a salary
router.delete('/:id', deleteSalary)

// UPDATE a salary
router.patch('/:id', updateSalary)

// Generate salary report
router.get('/generate-report', generateSalaryReport);


export default router;