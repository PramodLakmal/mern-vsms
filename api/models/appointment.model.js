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
  },
  { timestamps: true }
);

export default mongoose.model("Appointment", appointmentSchema);
