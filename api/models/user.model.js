import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
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
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
