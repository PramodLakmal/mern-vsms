import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema(
  {
    Title: {
      type: String,
      required: true,
    },
    Date: {
      type: Date,
      required: true,
    },
    NoticeType: {
      type: String,
      required: true,
    },
    Description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Notice", noticeSchema);
