import mongoose from "mongoose";

const { Schema } = mongoose;

const salarySchema = new mongoose.Schema(
  {
    employeeid: {
        type: Schema.Types.ObjectId,
        ref: "Employee",
        required: true,
    },
    month: {
        type: String,
        required: true, 
      },
    year: {
      type: Number,
      required: true, 
    },
    basicsalary: {
        type: Number,
        required: true,
    },
    othours: {
        type: Number,
        required: true,
        min: 0,
    },
    otrate: {
        type: Number,
        required: true,
    },
    ottotal: {
        type: Number,
        required: true,
        min: 0,
    },
    bonus: {
        type: Number,
        required: true,
        min: 0,
    },
    reduction: {
        type: Number,
        required: true,
        min: 0,
    },
    netsalary: {
        type: Number,
        required: true,
    }, 
  },
  { timestamps: true }
);

export default mongoose.model('salary', salarySchema);