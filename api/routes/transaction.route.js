import express from 'express';
import * as transactionController from '../controllers/transaction.controller.js';

const router = express.Router();

router.post('/save', transactionController.saveTransaction);
router.get('/user/:userId', transactionController.getTransactionsByUser);
router.get('/customer', transactionController.getTransactionsByCustomer);
router.get('/', transactionController.getAllTransactions); 

export default router;
