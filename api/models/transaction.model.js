//transaction model

import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const transactionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User' // Reference to the User model if customer is registered
  },
  customerName: String, // For manually added customer
  customerMobile: String, // For manually added customer
  selectedItems: [{ itemId: Schema.Types.ObjectId, quantity: Number }],
  selectedServices: [{ serviceId: Schema.Types.ObjectId }],
  totalAmount: Number,
  createdAt: { type: Date, default: Date.now }
});

const Transaction = model('Transaction', transactionSchema);

export default Transaction;
