import mongoose from "mongoose";

const Schema = mongoose.Schema;

const serviceSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  vehiclename: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    default: 'https://cdn.pixabay.com/photo/2016/02/24/17/15/service-1220327_640.png'
  }
}, { timestamps: true });



export default mongoose.model('Service', serviceSchema);
