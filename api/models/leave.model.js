import mongoose from "mongoose";

const { Schema } = mongoose;

const leaveSchema = new mongoose.Schema(
  {
    employeeid: {
        type: Schema.Types.ObjectId,
        ref: "Employee",
        required: true,
    },
    leavetype: {
        type: String,
        enum: ["Casual", "Annual", "Sick"],
        default: "",
      },
    startdate: {
      type: Date,
      default: Date.now,
      required: true, 
    },
    enddate: {
      type: Date,
      required: true,
    },
    numofdays: {
        type: Number,
        required: true,
    },
    reason: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        enum: ["Approved", "Rejected"],
        default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model('leave', leaveSchema);