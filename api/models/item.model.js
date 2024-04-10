import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  picture: {
    type: String,
    default: 'https://static.remove.bg/sample-gallery/graphics/bird-thumbnail.jpg'
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

const Item = mongoose.model('Item', itemSchema);
export default Item;