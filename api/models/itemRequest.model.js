//itemrequest
import mongoose from 'mongoose';

const { Schema } = mongoose;

const itemRequestSchema = new Schema({
  itemName: {
    type: String,
    required: true,
  },
  itemCode: {
    type: String,
    required: true,
    unique: true,
  },
  itemQuantity: {
    type: Number,
    required: true,
  },
  itemAvailability: {
    type: Boolean,
    default: true,
  },
  itemTotalPrice: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});

const ItemRequest = mongoose.model('ItemRequest', itemRequestSchema);

export default ItemRequest;
