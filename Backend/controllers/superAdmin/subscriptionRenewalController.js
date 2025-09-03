const AdminSubscriptionRenewal = require('../../models/superAdmin/SubscriptionRenewalModel.js');
const Admin = require('../../models/admin/AdminAccountModel.js')
const SubscriptionPlan = require('../../models/superAdmin/SubscriptionPlanModel.js')
const AdminSubscription=require('../../models/superAdmin/AdminSubscriptionTrackModel.js')
// POST /superadmin/renewals
exports.createRenewal = async (req, res) => {
  const {
    adminId,
    planId,
    subscriptionPlanId,
    startDate,
    endDate,
    amount,
    status,
    couponCode
  } = req.body;

  try {
    let finalAmount = parseFloat(amount);
    let discountAmount = 0;
    let appliedCoupon = null;

    // Apply coupon if exists
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
        discountAmount = (finalAmount * coupon.discountValue) / 100;
      } else {
        discountAmount = coupon.discountValue;
      }

      finalAmount = Math.max(finalAmount - discountAmount, 0);
      appliedCoupon = coupon;
    }

    const renewal = await AdminSubscriptionRenewal.create({
      adminId,
      planId,
      subscriptionPlanId,
      startDate,
      endDate,
      amount: finalAmount,
      discountAmount,
      couponCode: appliedCoupon?.code || null,
      status: status || 'Active'
    });

    // Update coupon usage if applied
    if (appliedCoupon) {
      appliedCoupon.usedCount += 1;
      await appliedCoupon.save();

      await CouponUsage.create({
        adminId,
        couponId: appliedCoupon.id
      });
    }

    res.status(201).json({ message: 'Renewal created successfully', renewal });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create renewal', details: error.message });
  }
};


// GET /superadmin/renewals
exports.getAllRenewals = async (req, res) => {
  try {
 const renewals = await AdminSubscriptionRenewal.findAll({
  include: [
    { model: Admin, as: 'admin' },
    { model: SubscriptionPlan, as: 'plan' },
    { model: AdminSubscription, as: 'subscriptionTrack' }
  ]
});


    res.status(200).json(renewals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch renewals', details: error.message });
  }
};

// GET /superadmin/renewals/:id
exports.getRenewalById = async (req, res) => {
  const { id } = req.params;
  try {
    const renewal = await AdminSubscriptionRenewal.findByPk(id);
    if (!renewal) return res.status(404).json({ error: 'Renewal not found' });

    res.status(200).json(renewal);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch renewal', details: error.message });
  }
};

// PUT /superadmin/renewals/:id
exports.updateRenewal = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const renewal = await AdminSubscriptionRenewal.findByPk(id);
    if (!renewal) return res.status(404).json({ error: 'Renewal not found' });

    renewal.status = status;
    await renewal.save();

    res.status(200).json({ message: 'Renewal updated successfully', renewal });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update renewal', details: error.message });
  }
};

// DELETE /superadmin/renewals/:id
exports.deleteRenewal = async (req, res) => {
  const { id } = req.params;

  try {
    const renewal = await AdminSubscriptionRenewal.findByPk(id);
    if (!renewal) return res.status(404).json({ error: 'Renewal not found' });

    await renewal.destroy();
    res.status(200).json({ message: 'Renewal deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete renewal', details: error.message });
  }
};

// GET /superadmin/renewals/by-admin/:adminId
exports.getRenewalsByAdminId = async (req, res) => {
  const { adminId } = req.params;

  try {
    const renewals = await AdminSubscriptionRenewal.findAll({
      where: { adminId },
      order: [['createdAt', 'DESC']],
     include: [
  { model: SubscriptionPlan, as: 'plan' },
  { model: AdminSubscription, as: 'subscriptionTrack' }
]
// if associations defined
    });

    if (!renewals || renewals.length === 0) {
      return res.status(404).json({ message: 'No renewals found for this admin' });
    }

    res.status(200).json(renewals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch renewals for admin', details: error.message });
  }
};
