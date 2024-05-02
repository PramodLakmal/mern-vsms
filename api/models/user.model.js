import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      min: 3,
      max: 20,
    },
    age: {
      type: Number,
      required: false,
    },
    phoneNumber: {
      type: Number,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default: "https://img.freepik.com/premium-photo/purple-purple-image-man-with-white-shirt-front_745528-2351.jpg",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    
    },
    isCustomerServiceAgent: {
      type: Boolean,
      default: false,
    },
    isFinanceManager: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
