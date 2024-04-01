import mongoose from "mongoose";

const Schema = mongoose.Schema;

const emergencySchema = new Schema({
  // Other fields remain unchanged
  servicetype: {
    type: String,
    enum: ["Mechanical", "Tire", "Battery"],
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
  },
  area: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["accept", "reject"], // Ensure no extra spaces or characters
    required: true
  },
  
  image: {
    type: String,
    default: 'https://cdn.pixabay.com/photo/2016/02/24/17/15/service-1220327_640.png'
  }
}, { timestamps: true });

export default mongoose.model('Emergency', emergencySchema);
