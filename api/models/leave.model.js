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
      validate: {
        validator: function(value) {
          return value >= new Date(); // Ensure start date is today or future date
        },
        message: 'Start date must be today or a future date.'
      }
    },
    enddate: {
      type: Date,
      required: true,
      validate: {
        validator: function(value) {
          return value >= new Date(); // Ensure end date is today or future date
        },
        message: 'End date must be today or a future date.'
      }
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
      enum: ["Approved", "Rejected", "Pending"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model('leave', leaveSchema);
