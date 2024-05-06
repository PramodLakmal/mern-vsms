//product.model.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      default:
        'https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png',
    },
    category: {
      type: String,
      default: 'uncategorized',
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    itemPrice: {
        type: String,
        required: true,
      },
    itemQuantity: {
        type: String,
        required: true,
      },
    
  },
  { timestamps: true }
);

const Product = mongoose.model('product', productSchema);

export default Product;
