import express from 'express';

import {
    getEmployees,
    getEmployee,
    createEmployee,
    deleteEmployee,
    updateEmployee,
    searchEmployees,
} from "../controllers/employee.controller.js"


const router = express.Router()

// GET all employees
router.get('/', getEmployees)

// GET a single employee
router.get('/:id', getEmployee)

// Search employees by first or last name
router.get('/search/:query', searchEmployees);

// POST a new employee
router.post('/', createEmployee)

// DELETE a employee
router.delete('/:id', deleteEmployee)

// UPDATE a employee
router.patch('/:id', updateEmployee)

export default router;