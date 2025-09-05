const { v4: uuidv4 } = require('uuid');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const AdminSubscription = require('../../models/superAdmin/AdminSubscriptionTrackModel.js');
const SubscriptionPlan = require('../../models/superAdmin/SubscriptionPlanModel.js');
const PaymentTransaction = require('../../models/superAdmin/PaymentTransactionModel.js');
const Coupon = require('../../models/superAdmin/CouponModel.js'); // Add this
const CouponUsage = require('../../models/superAdmin/CoupanUsageModel.js'); // if you create this model

// ✅ Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.SUPERADMIN_RAZORPAY_KEY_ID,
  key_secret: process.env.SUPERADMIN_RAZORPAY_KEY_SECRET,
});

// 2️⃣ Create Razorpay order for subscription plan
// exports.createSubscriptionOrder = async (req, res) => {
//   const { planId } = req.body;
//   const adminId = req.user.id;

//   try {
//     const plan = await SubscriptionPlan.findByPk(planId);
//     if (!plan) return res.status(404).json({ error: 'Plan not found' });

//     const amountInPaise = plan.monthlyPrice * 100;

//     const order = await razorpay.orders.create({
//       amount: amountInPaise,
//       currency: 'INR',
//       receipt: `receipt_${Date.now()}`.substring(0, 40), // shorter and readable
//       payment_capture: 1,
//     });

//     res.status(200).json({
//       orderId: order.id,
//       amount: order.amount,
//       currency: order.currency,
//       planId,
//     });
//   }catch (err) {
//   console.error("Razorpay Order Error:", err); // Add this line for server log
//   res.status(500).json({ error: 'Error creating Razorpay order', details: err.message });
// }

// };

exports.createSubscriptionOrder = async (req, res) => {
  const { planId, couponCode, billingType = 'monthly' } = req.body;
  const adminId = req.user.id;

  try {
    const plan = await SubscriptionPlan.findByPk(planId);
    if (!plan) return res.status(404).json({ error: 'Plan not found' });

    const price = billingType === 'annual'
      ? parseFloat(plan.annualPrice)
      : parseFloat(plan.monthlyPrice);

    let finalAmount = price;
    let appliedCoupon = null;
    let discount = 0;

    if (couponCode) {
      const coupon = await Coupon.findOne({
        where: { code: couponCode, isActive: true },
      });

      if (!coupon) return res.status(400).json({ error: 'Invalid coupon' });
      if (coupon.expiresAt && new Date() > coupon.expiresAt)
        return res.status(400).json({ error: 'Coupon expired' });

      if (coupon.maxUsage && coupon.usedCount >= coupon.maxUsage)
        return res.status(400).json({ error: 'Coupon usage limit reached' });

      const alreadyUsed = await CouponUsage.findOne({
        where: { adminId, couponId: coupon.id }
      });

      if (alreadyUsed) {
        return res.status(400).json({ error: 'You have already used this coupon.' });
      }

      if (coupon.discountType === 'percentage') {
        discount = (price * coupon.discountValue) / 100;
      } else {
        discount = coupon.discountValue;
      }

      finalAmount = Math.max(price - discount, 0);
      appliedCoupon = coupon;
    }

    const amountInPaise = Math.round(finalAmount * 100);

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`.substring(0, 40),
      payment_capture: 1,
    });

    res.status(200).json({
      orderId: order.id,
      amount: amountInPaise,
      currency: order.currency,
      planId,
      finalAmount,
      discount,
      couponCode: appliedCoupon?.code || null,
      couponId: appliedCoupon?.id || null,
      billingType
    });

  } catch (err) {
    console.error("Razorpay Order Error:", err);
    res.status(500).json({ error: 'Error creating Razorpay order', details: err.message });
  }
};




// 3️⃣ Verify payment and activate subscription
// exports.verifyAndActivateSubscription = async (req, res) => {
//   const { razorpay_payment_id, razorpay_order_id, planId } = req.body;
//   const adminId = req.user.id;

//   try {
//     // 🔍 Fetch subscription plan
//     const plan = await SubscriptionPlan.findByPk(planId);
//     if (!plan) return res.status(404).json({ error: 'Plan not found' });

//     // 💳 Record transaction
//   const transaction = await PaymentTransaction.create({
//   transactionId: razorpay_payment_id,   // ✅ Add this
//   provider: 'razorpay',                 // ✅ Add this
//   type: 'subscription',                 // ✅ Add this (or 'purchase' / 'plan' depending on your logic)
//   paymentId: razorpay_payment_id,
//   orderId: razorpay_order_id,
//   adminId,
//   planId,
//   amount: plan.monthlyPrice,
//   status: 'Paid' ,
//   method: 'razorpay'
// });


//     // 📅 Activate subscription
//     const subscription = await AdminSubscription.create({
//       adminId,
//     subscriptionPlanId: planId,
//       paymentId: transaction.id,
//       startDate: new Date(),
//       endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
//       isActive: true,
//       paymentStatus:"Paid"
//     });

//     res.status(200).json({
//       message: 'Subscription activated successfully',
//       subscription
//     });

//   } catch (err) {
//     res.status(500).json({ error: 'Subscription activation failed', details: err.message });
//   }
// };

exports.verifyAndActivateSubscription = async (req, res) => {
  const {
    razorpay_payment_id,
    razorpay_order_id,
    planId,
    couponId,
    billingType = 'monthly'
  } = req.body;

  const adminId = req.user.id;

  try {
    const plan = await SubscriptionPlan.findByPk(planId);
    if (!plan) return res.status(404).json({ error: 'Plan not found' });

    const price = billingType === 'annual'
      ? parseFloat(plan.annualPrice)
      : parseFloat(plan.monthlyPrice);

    const durationInMonths = billingType === 'annual' ? 12 : 1;

    // Record payment transaction
    const transaction = await PaymentTransaction.create({
      transactionId: razorpay_payment_id,
      provider: 'razorpay',
      type: 'subscription',
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      adminId,
      planId,
      amount: price,
      status: 'Paid',
      method: 'razorpay'
    });

    // Calculate new subscription period
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + durationInMonths);

    // Check if admin already has a subscription
    let existingSub = await AdminSubscription.findOne({ where: { adminId } });

    if (existingSub) {
      // Renewal: update old subscription
      existingSub.subscriptionPlanId = planId;
      existingSub.startDate = startDate;
      existingSub.endDate = endDate;
      existingSub.paymentId = transaction.id;
      existingSub.paymentStatus = 'Paid';
      existingSub.isActive = true;
      await existingSub.save();
    } else {
      // New subscription
      existingSub = await AdminSubscription.create({
        adminId,
        subscriptionPlanId: planId,
        paymentId: transaction.id,
        startDate,
        endDate,
        isActive: true,
        paymentStatus: "Paid"
      });
    }

    // Track renewal
    await AdminSubscriptionRenewal.create({
      adminId,
      planId,
      subscriptionPlanId: planId,
      startDate,
      endDate,
      amount: price,
      status: 'Active',
      couponCode: couponId ? (await Coupon.findByPk(couponId))?.code : null,
      discountAmount: couponId ? (await Coupon.findByPk(couponId))?.discountValue || 0 : 0
    });

    // Coupon usage update
    if (couponId) {
      const coupon = await Coupon.findByPk(couponId);
      if (coupon) {
        coupon.usedCount += 1;
        await coupon.save();

        await CouponUsage.create({
          adminId,
          couponId: coupon.id
        });
      }
    }

    res.status(200).json({
      message: 'Subscription activated successfully',
      subscription: existingSub
    });

  } catch (err) {
    console.error("Subscription Error:", err);
    res.status(500).json({ error: 'Subscription activation failed', details: err.message });
  }
};



