import mongoose from "mongoose";
const ExpenseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    amount: {
        type: Number,
        required: true,
        maxLength: 20,
        trim: true
    },
    type: {
        type: String,
        default:"expense"
    },
    date: {
        type: Date,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: true,
        maxLength: 1000,
        trim: true
    },
}, {timestamps: true})

export default mongoose.model('Expense',ExpenseSchema);