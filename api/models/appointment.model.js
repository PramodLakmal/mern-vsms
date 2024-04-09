import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    Name: {
      type: String,
      required: true,
    },
    VehicleNo: {
      type: String,
      required: true,
    },
    ContactNo: {
      type: String,
      required: true,
    },
    Date: {
      type: Date,
      required: true,
    },
    TimeSlot: {
      type: String,
      required: true,
    },
    Service: {
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

export default mongoose.model("Appointment", appointmentSchema);
