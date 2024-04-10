import Transaction from '../models/transaction.model.js';

export const saveTransaction = async (req, res, next) => {
  try {
    const transactionData = req.body;
    const transaction = await Transaction.create(transactionData);
    res.status(201).json({ success: true, transaction });
  } catch (error) {
    console.error('Error saving transaction:', error);
    next(error); // Pass error to error handling middleware
  }
};

export const getTransactionsByUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const transactions = await Transaction.find({ userId });
    res.json({ success: true, transactions });
  } catch (error) {
    console.error('Error retrieving transactions:', error);
    next(error);
  }
};

export const getTransactionsByCustomer = async (req, res, next) => {
  try {
    const { customerName, customerMobile } = req.query;
    const transactions = await Transaction.find({ customerName, customerMobile });
    res.json({ success: true, transactions });
  } catch (error) {
    console.error('Error retrieving transactions:', error);
    next(error);
  }
};

export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().populate('userId');
    res.status(200).json({ transactions });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch transactions', error: error.message });
  }
};