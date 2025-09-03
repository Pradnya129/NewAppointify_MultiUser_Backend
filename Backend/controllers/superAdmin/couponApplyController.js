// controllers/admin/couponApplyController.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const Coupon = require('../../models/superAdmin/CouponModel.js');
const SubscriptionPlan = require('../../models/superAdmin/SubscriptionPlanModel.js');



// 📌 Create
exports.createCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, data: coupon });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
  }
};

// 📌 Get All
exports.getAllCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.findAll();
    res.json({ success: true, data: coupons });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
  }
};

// 📌 Get Single
exports.getCouponById = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByPk(req.params.id);
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });

    res.json({ success: true, data: coupon });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
  }
};

// 📌 Update
// 📌 PATCH /api/superadmin/coupons/:id
exports.updateCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findByPk(id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }

    // Only update fields that are provided (PATCH behavior)
    const fieldsToUpdate = {};

    if (req.body.code !== undefined) fieldsToUpdate.code = req.body.code;
    if (req.body.discountType !== undefined) fieldsToUpdate.discountType = req.body.discountType;
    if (req.body.discountValue !== undefined) fieldsToUpdate.discountValue = req.body.discountValue;
    if (req.body.maxUsage !== undefined) fieldsToUpdate.maxUsage = req.body.maxUsage;
    if (req.body.usedCount !== undefined) fieldsToUpdate.usedCount = req.body.usedCount;
    if (req.body.expiresAt !== undefined) fieldsToUpdate.expiresAt = req.body.expiresAt;
    if (req.body.isActive !== undefined) fieldsToUpdate.isActive = req.body.isActive;

    await coupon.update(fieldsToUpdate);

    res.json({ success: true, message: 'Coupon updated successfully', data: coupon });
  } catch (err) {
    console.error("❌ Error in updateCoupon:", err);
    res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
  }
};


// 📌 Delete
exports.deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByPk(req.params.id);
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });

    await coupon.destroy();
    res.json({ success: true, message: 'Coupon deleted' });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
  }
};

exports.validateCoupon = async (req, res, next) => { 
  try {
    const { code, planId, billingType = 'monthly' } = req.body;

    const coupon = await Coupon.findOne({ where: { code, isActive: true } });
    if (!coupon) return res.status(404).json({ success: false, message: 'Invalid or inactive coupon' });

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date())
      return res.status(400).json({ success: false, message: 'Coupon expired' });

    if (coupon.maxUsage && coupon.usedCount >= coupon.maxUsage)
      return res.status(400).json({ success: false, message: 'Coupon usage limit reached' });

    const plan = await SubscriptionPlan.findByPk(planId);
    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });

    // Choose the correct price
    const price = billingType === 'annual' ? parseFloat(plan.annualPrice) : parseFloat(plan.monthlyPrice);

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (price * coupon.discountValue) / 100;
    } else {
      discount = coupon.discountValue;
    }

    const finalAmount = Math.max(price - discount, 0);

    res.json({
      success: true,
      data: {
        code: coupon.code,
        billingType,
        planName: plan.planName,
        originalPrice: price.toFixed(2),
        discount: discount.toFixed(2),
        finalAmount: finalAmount.toFixed(2),
        couponId: coupon.id
      }
    });
  } catch (err) {
    next(err);
  }
};
