import express from 'express';
import {
    getExpenses,
    getExpense,
    addExpense,
    deleteExpense,
    updateExpense
} from "../controllers/expense.controller.js";

const router = express.Router();

// GET all expenses
router.get('/', getExpenses);

// GET a single expense
router.get('/:id', getExpense);

// POST a new expense 
router.post('/', addExpense);

// DELETE an expense 
router.delete('/:id', deleteExpense);

// UPDATE an expense 
router.patch('/:id', updateExpense);

export default router;
