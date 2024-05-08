import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    vehicleNo: {
      type: String,
      required: true,
    },
    contactNo: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
    },
    service: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: false,
    },
    isPaid: {
      type: Boolean,
      default: false,
      required: false,
    },
    amount: {
      type: Number,
      required: false,
    },
    completed: {
      type: Boolean,
      default: false,
      required: false,
    },
    cancelled: {
      type: Boolean,
      default: false,
      required: false,
    },
    refunded: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("appointment", appointmentSchema);