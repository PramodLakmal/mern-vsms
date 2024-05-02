import express from 'express';
import {
    getIncomes,
    getIncome,
    addIncome,
    deleteIncome,
    updateIncome
} from "../controllers/income.controller.js";

const router = express.Router();

// GET all expenses
router.get('/', getIncomes);

// GET a single expense
router.get('/:id', getIncome);

// POST a new expense 
router.post('/', addIncome);

// DELETE an expense 
router.delete('/:id', deleteIncome);

// UPDATE an expense 
router.patch('/:id', updateIncome);

 

export default router;
