const SubscriptionPlan = require('../../models/superAdmin/SubscriptionPlanModel.js');
const AdminSubscription = require('../../models/superAdmin/AdminSubscriptionTrackModel.js');
const Admin = require('../../models/admin/AdminAccountModel.js')
// Get all subscription plans
exports.getAllPlans = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.findAll();
    res.json(plans);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch plans', details: err.message });
  }
};


// Get single plan by ID
exports.getPlanById = async (req, res) => {
  try {
    const plan = await SubscriptionPlan.findByPk(req.params.id);
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    res.json(plan);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch plan', details: err.message });
  }
};

// Create new subscription plan
exports.createPlan = async (req, res) => {
  try {
    const newPlan = await SubscriptionPlan.create(req.body);
    res.status(201).json(newPlan);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create plan', details: err.message });
  }
};

// Update subscription plan
exports.updatePlan = async (req, res) => {
  try {
    const plan = await SubscriptionPlan.findByPk(req.params.id);
    if (!plan) return res.status(404).json({ message: 'Plan not found' });

    await plan.update(req.body);
    res.json(plan);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update plan', details: err.message });
  }
};

// Delete a plan
exports.deletePlan = async (req, res) => {
  try {
    const plan = await SubscriptionPlan.findByPk(req.params.id);
    if (!plan) return res.status(404).json({ message: 'Plan not found' });

    await plan.destroy();
    res.json({ message: 'Plan deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete plan', details: err.message });
  }
};

// ✅ Assign subscription to admin (adminId from request body)
exports.assignSubscription = async (req, res) => {
  try {
      console.log("Authenticated role:", req.user.role);
    if (req.user?.role !== 'superadmin') {
      return res.status(403).json({ message: 'Forbidden: Only Super Admin can assign subscriptions' });
    }

    const { adminId, subscriptionPlanId, startDate, endDate, paymentStatus } = req.body;

    if (!adminId || !subscriptionPlanId || !startDate || !endDate) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newSub = await AdminSubscription.create({
      adminId,
      subscriptionPlanId,
      startDate,
      endDate,
      paymentStatus,
      isActive: paymentStatus === 'Paid'
    });

    res.status(201).json(newSub);
  } catch (err) {
    res.status(400).json({ error: 'Failed to assign subscription', details: err.message });
  }
};

// ✅ Get subscriptions for specific admin (adminId from params, visible to superAdmin or that same admin)
// 🔍 Get subscriptions assigned to a specific admin
exports.getAdminSubscriptions = async (req, res, next) => {
  try {
    const { adminId } = req.params;

    const subscriptions = await AdminSubscription.findAll({
      where: { adminId },
      include: [
        {
          model: SubscriptionPlan,
          attributes: ['id', 'planName', 'monthlyPrice', 'annualPrice'] // pick what you need
        }
      ]
    });

    if (!subscriptions || subscriptions.length === 0) {
      return res.status(404).json({
        error: 'No subscriptions found',
        details: `No subscriptions assigned to admin ID ${adminId}`
      });
    }

    res.json(subscriptions);
  } catch (err) {
    console.error('🔴 Failed to fetch subscriptions:', err);
    res.status(500).json({
      error: 'Failed to fetch subscriptions',
      details: err.message
    });
  }
};


// Update subscription (status, dates, etc.)
exports.updateSubscription = async (req, res) => {
  try {
    const subscription = await AdminSubscription.findByPk(req.params.id);
    if (!subscription) return res.status(404).json({ message: 'Subscription not found' });

    await subscription.update(req.body);
    res.json(subscription);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update subscription', details: err.message });
  }
};
// ✅ Get all admin subscriptions with plan and admin info
exports.getAllAdminSubscriptions = async (req, res) => {
  try {
    const subscriptions = await AdminSubscription.findAll({
      include: [
        {
          model: SubscriptionPlan,
          attributes: ['id', 'planName', 'monthlyPrice', 'annualPrice']
        },
        {
          model: Admin,
          attributes: ['id', 'firstName','lastName', 'email'] // include whatever admin fields you want
        }
      ]
    });

    res.json(subscriptions);
  } catch (err) {
    console.error('🔴 Error fetching all admin subscriptions:', err);
    res.status(500).json({
      error: 'Failed to fetch all admin subscriptions',
      details: err.message
    });
  }
};