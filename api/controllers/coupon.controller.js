import Coupon from '../models/coupon.model.js';

// Create a new coupon
export const createCoupon = async (req, res, next) => {
  try {
    const couponData = req.body;
    const coupon = new Coupon(couponData);
    await coupon.save();
    res.status(201).json({ message: 'Coupon created successfully', coupon });
  } catch (error) {
    next(error);
  }
};

// Get all coupons
export const getAllCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find();
    res.status(200).json({coupons});
  } catch (error) {
    next(error);
  }
};

// Apply coupon to order
export const applyCoupon = async (req, res, next) => {
  try {
    const { couponCode } = req.body;
    const coupon = await Coupon.findOne({ code: couponCode, isActive: true });
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found or inactive' });
    }
    // Logic to apply coupon to order
    // Example: Calculate discounted total based on coupon
    res.status(200).json({ message: 'Coupon applied successfully', coupon });
  } catch (error) {
    next(error);
  }
};

// Get a single coupon by ID
export const getCouponById = async (req, res, next) => {
    try {
      const couponId = req.params.id;
      const coupon = await Coupon.findById(couponId);
      if (!coupon) {
        return res.status(404).json({ message: 'Coupon not found' });
      }
      res.status(200).json(coupon);
    } catch (error) {
      next(error);
    }
  };

  // Delete a coupon by ID
export const deleteCouponById = async (req, res, next) => {
  try {
    const couponId = req.params.id;
    const deletedCoupon = await Coupon.findByIdAndDelete(couponId);
    if (!deletedCoupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    res.status(200).json({ message: 'Coupon deleted successfully', deletedCoupon });
  } catch (error) {
    next(error);
  }
};

// Update a coupon by ID
export const updateCouponById = async (req, res, next) => {
  try {
    const couponId = req.params.id;
    const updatedCouponData = req.body;
    const updatedCoupon = await Coupon.findByIdAndUpdate(couponId, updatedCouponData, { new: true });
    if (!updatedCoupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    res.status(200).json({ message: 'Coupon updated successfully', updatedCoupon });
  } catch (error) {
    next(error);
  }
};