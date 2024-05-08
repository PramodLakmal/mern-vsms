import mongoose from "mongoose";

// Assuming these are your specific user and service IDs
const defaultUserId = "660d26d62f2d9a9ed78bb293";
const defaultServiceId = "6614f033eaaa3a8a7c6f86eb";

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
      default: () => new mongoose.Types.ObjectId(defaultUserId)
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: false,
      default: () => new mongoose.Types.ObjectId(defaultServiceId)
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
