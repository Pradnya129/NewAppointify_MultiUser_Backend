const { v4: uuidv4 } = require('uuid');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const AdminSubscription = require('../../models/superAdmin/AdminSubscriptionTrackModel.js');
const SubscriptionPlan = require('../../models/superAdmin/SubscriptionPlanModel.js');
const PaymentTransaction = require('../../models/superAdmin/PaymentTransactionModel.js');
const Coupon = require('../../models/superAdmin/CouponModel.js'); // Add this
const CouponUsage = require('../../models/superAdmin/CoupanUsageModel.js'); 
const Renewal=require('../../models/admin/RenewalModel.js')
const AdminSubscriptionRenewal=require('../../models/superAdmin/SubscriptionRenewalModel.js')

// ✅ Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.SUPERADMIN_RAZORPAY_KEY_ID,
  key_secret: process.env.SUPERADMIN_RAZORPAY_KEY_SECRET,
});

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




exports.verifyAndActivateSubscription = async (req, res) => {
  const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    planId,
    couponId,
    billingType = "monthly"
  } = req.body;

  const adminId = req.user.id;

  try {
    // 🔍 Log Razorpay params for debugging
    console.log("🔹 Razorpay Verification Params:");
    console.log("   razorpay_payment_id:", razorpay_payment_id);
    console.log("   razorpay_order_id:", razorpay_order_id);
    console.log("   razorpay_signature:", razorpay_signature);

    // 1️⃣ Verify Razorpay signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.SUPERADMIN_RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      console.error("❌ Signature mismatch!");
      return res
        .status(400)
        .json({ error: "Invalid signature. Payment verification failed." });
    }
    console.log("✅ Signature verified successfully");

    // 2️⃣ Fetch plan
    const plan = await SubscriptionPlan.findByPk(planId);
    if (!plan) return res.status(404).json({ error: "Plan not found" });

    const price =
      billingType === "annual"
        ? parseFloat(plan.annualPrice)
        : parseFloat(plan.monthlyPrice);

    const durationInMonths = billingType === "annual" ? 12 : 1;

    // 3️⃣ Record payment transaction
    const transaction = await PaymentTransaction.create({
      transactionId: razorpay_payment_id,
      provider: "razorpay",
      type: "subscription",
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      adminId,
      planId,
      amount: price,
      status: "Paid",
      method: "razorpay",
    });

    // 4️⃣ Calculate new subscription period
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + durationInMonths);

    // 5️⃣ Create or update subscription
    let existingSub = await AdminSubscription.findOne({ where: { adminId } });

    if (existingSub) {
      existingSub.subscriptionPlanId = planId;
      existingSub.startDate = startDate;
      existingSub.endDate = endDate;
      existingSub.paymentId = transaction.id;
      existingSub.paymentStatus = "Paid";
      existingSub.isActive = true;
      await existingSub.save();
    } else {
      existingSub = await AdminSubscription.create({
        adminId,
        subscriptionPlanId: planId,
        paymentId: transaction.id,
        startDate,
        endDate,
        isActive: true,
        paymentStatus: "Paid",
      });
    }

    // 6️⃣ Track renewal (superadmin view)
  await AdminSubscriptionRenewal.create({
  adminId,
  planId,                       // This stays as the subscription plan id
  subscriptionPlanId: existingSub.id,  // ✅ Must be AdminSubscription.id
  startDate,
  endDate,
  amount: price,
  status: "Active",
  couponCode: couponId ? (await Coupon.findByPk(couponId))?.code : null,
  discountAmount: couponId ? (await Coupon.findByPk(couponId))?.discountValue || 0 : 0,
});


    // 7️⃣ Track renewal (admin view)
    await Renewal.create({
      adminId,
      planId: planId,  
      duration: billingType === "annual" ? "12 months" : "1 month",
      startDate,
      endDate,
      amount: price,
      status: "Paid",
      description: `Renewed via Razorpay (Txn: ${razorpay_payment_id})`,
    });

    // 8️⃣ Update coupon usage
    if (couponId) {
      const coupon = await Coupon.findByPk(couponId);
      if (coupon) {
        coupon.usedCount += 1;
        await coupon.save();

        await CouponUsage.create({
          adminId,
          couponId: coupon.id,
        });
      }
    }

    res.status(200).json({
      message: "Subscription activated successfully",
      subscription: existingSub,
    });
  } catch (err) {
    console.error("❌ Subscription Error:", err.message);
    res
      .status(500)
      .json({ error: "Subscription activation failed", details: err.message });
  }
};






