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
      type: String, // Considering phone numbers may contain non-numeric characters
      required: false,
      unique: true,
      validate: {
        validator: function(v) {
          // Remove non-digit characters and check if the resulting string is 10 digits long
          const cleaned = v.replace(/\D/g, ''); // Remove non-digit characters
          return cleaned.length === 10;
        },
        message: props => `${props.value} is not a valid phone number!`,
      },
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
    isEmployee: {
      type: Boolean,
      default: false,
    },
    isCashier: {
      type: Boolean,
      default: false,
    },
    isSupplier: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
