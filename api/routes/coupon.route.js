import express from 'express';
import { createCoupon, getAllCoupons, applyCoupon, getCouponById, deleteCouponById, updateCouponById } from '../controllers/coupon.controller.js';

const router = express.Router();

// Route to create a new coupon
router.post('/create', createCoupon);

// Route to get all coupons
router.get('/all', getAllCoupons);

// Route to get a single coupon by ID
router.get('/:id', getCouponById);

// Route to apply coupon to order
router.post('/apply', applyCoupon);

// Route to delete a coupon by ID
router.delete('/:id', deleteCouponById);

router.put('/update/:id', updateCouponById);

export default router;
