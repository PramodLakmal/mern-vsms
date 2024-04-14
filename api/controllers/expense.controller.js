import  Expense  from '../models/expense.model.js';

import mongoose from 'mongoose'; 

// Get all expenses
const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({}).sort({createdAt: -1});
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({message: 'Server Error', error: error.message});
    }
};

// Get a single expense by ID
const getExpense = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({message: 'No such expense'});
    }

    const expense = await Expense.findById(id);

    if (!expense) {
        return res.status(404).json({message: 'No such expense'});
    }

    res.status(200).json(expense);
};

// Add a new expense
const addExpense = async (req, res) => {
    const {title, amount, category, description, date} = req.body;

    // Fixed validation for amount to correctly check if it's a number
    if(!title || !category || !description || !date || amount <= 0 || typeof amount !== 'number'){
        return res.status(400).json({message: 'All fields are required and amount must be a positive number!'});
    }

    try {
        const expense = await Expense.create({ title, amount, category, description, date});
        res.status(200).json(expense);
    } catch (error) {
        res.status(400).json({message: 'Error adding expense', error: error.message});
    }
};

// Delete an expense by ID
const deleteExpense = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({message: 'No such expense'});
    }

    const expense = await Expense.findByIdAndDelete(id);

    if (!expense) {
        return res.status(404).json({message: 'No such expense'});
    }

    res.status(200).json({message: 'Expense Deleted'});
};

// Update an existing expense by ID
const updateExpense = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({message: 'No such expense'});
    }

    const expense = await Expense.findByIdAndUpdate(id, req.body, { new: true });

    if (!expense) {
        return res.status(404).json({message: 'No such expense'});
    }

    res.status(200).json(expense);
};

export {
    getExpenses,
    getExpense,
    addExpense,
    deleteExpense,
    updateExpense
};