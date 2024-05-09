import mongoose from "mongoose";
const IncomeSchema = new mongoose.Schema({
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
        trim: true,
        validate: {
          validator: function (value) {
            const currentDate = new Date();
            return value <= currentDate; // Ensure the date is not in the future
          },
          message: "Date cannot be in the future.",
        },
      },
    description: {
        type: String,
        required: true,
        maxLength: 1000,
        trim: true
    },
}, {timestamps: true})

export default mongoose.model('Income',IncomeSchema);