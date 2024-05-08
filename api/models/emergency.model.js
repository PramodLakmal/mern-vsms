import mongoose from "mongoose";

const Schema = mongoose.Schema;

const emergencySchema = new Schema({
  // Other fields remain unchanged
  servicetype: {
    type: String,
    enum: ["Mechanical Repair", "Tire Replacement", "Battery Services","other"],
    default: ""
  },
  othertype: {
    type: String,
    required: true
  },
  cusname: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to midnight for consistency
      return today;
    }
  },
  area: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["pending" ,"accept", "reject"], // Ensure no extra spaces or characters
    required: true
  },
  
  images: [{   // Changed to an array of strings
    type: String
  }]
}, { timestamps: true });

export default mongoose.model('Emergency', emergencySchema);
