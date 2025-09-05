const AdminPlan = require('../../models/admin/AdminPlans.js');

// Add Plan
exports.createPlan = async (req, res) => {
  try {
    const { planName, planPrice, planDuration, planDescription, planFeatures } = req.body;

    const newPlan = await AdminPlan.create({
      adminId: req.user.id,
      planName,
      planPrice,
      planDuration,
      planDescription,
      planFeatures,
    });

    res.status(201).json({
      message: 'Plan added successfully',
      plan: newPlan
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating plan', error: error.message });
  }
};

// Get All Plans for Admin
exports.getAllPlans = async (req, res) => {
  try {
    const plans = await AdminPlan.findAll({ where: { adminId: req.user.id } });
    res.status(200).json(plans);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching plans', error: error.message });
  }
};

// Get Plans by Name
exports.getPlansByName = async (req, res) => {
  try {
    const { planName } = req.params;
    const plans = await AdminPlan.findAll({
      where: {
        adminId: req.user.id,
        planName
      }
    });
    res.status(200).json(plans);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching plans', error: error.message });
  }
};

// Update Plan
exports.updatePlan = async (req, res) => {
  try {
    const { planName, planPrice, planDuration, planDescription, planFeatures } = req.body;
    const { planId } = req.params;

    const plan = await AdminPlan.findOne({ where: { planId, adminId: req.user.id } });
    if (!plan) return res.status(404).json({ message: 'Plan not found' });

    plan.planName = planName;
    plan.planPrice = planPrice;
    plan.planDuration = planDuration;
    plan.planDescription = planDescription;
    plan.planFeatures = planFeatures;

    await plan.save();

    res.status(200).json({ message: 'Plan updated successfully', plan });
  } catch (error) {
    res.status(500).json({ message: 'Error updating plan', error: error.message });
  }
};

// Delete Plan
exports.deletePlan = async (req, res) => {
  try {
    const { planId } = req.params;

    const plan = await AdminPlan.findOne({ where: { planId, adminId: req.user.id } });
    if (!plan) return res.status(404).json({ message: 'Plan not found' });

    await plan.destroy();
    res.status(200).json({ message: 'Plan deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting plan', error: error.message });
  }
};
