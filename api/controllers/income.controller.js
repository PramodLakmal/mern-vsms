import  Income  from '../models/income.model.js';

import mongoose from 'mongoose'; 

// Get all expenses
const getIncomes = async (req, res) => {
    try {
        const expenses = await Expense.find({}).sort({createdAt: -1});
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({message: 'Server Error', error: error.message});
    }
};

// Get a single expense by ID
const getIncome = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({message: 'No such income'});
    }

    const income = await Income.findById(id);

    if (!income) {
        return res.status(404).json({message: 'No such income'});
    }

    res.status(200).json(income);
};

// Add a new expense
const addIncome = async (req, res) => {
    const {title, amount, category, description, date} = req.body;

    // Fixed validation for amount to correctly check if it's a number
    if(!title || !category || !description || !date || amount <= 0 || typeof amount !== 'number'){
        return res.status(400).json({message: 'All fields are required and amount must be a positive number!'});
    }

    try {
        const income = await Income.create({ title, amount, category, description, date});
        res.status(200).json(income);
    } catch (error) {
        res.status(400).json({message: 'Error adding income', error: error.message});
    }
};

// Delete an expense by ID
const deleteIncome = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({message: 'No such income'});
    }

    const income = await Income.findByIdAndDelete(id);

    if (!income) {
        return res.status(404).json({message: 'No such income'});
    }

    res.status(200).json({message: 'income Deleted'});
};

// Update an existing expense by ID
const updateIncome = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({message: 'No such income'});
    }

    const income = await Income.findByIdAndUpdate(id, req.body, { new: true });

    if (!income) {
        return res.status(404).json({message: 'No such income'});
    }

    res.status(200).json(income);
};

export {
    getIncomes,
    getIncome,
    addIncome,
    deleteIncome,
    updateIncome
};