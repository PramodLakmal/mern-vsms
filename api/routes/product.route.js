
import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { createProduct, deleteProduct, getProducts, updateProduct, getProduct } from '../controllers/product.controller.js';

const router = express.Router();

router.post('/create', verifyToken, createProduct);
router.get('/getproducts', getProducts);
router.delete('/deleteproduct/:productId/:userId', verifyToken, deleteProduct);
router.put('/updateproduct/:productId', updateProduct);
router.get('/getproduct/:productId', getProduct);

export default router;
