// controllers/planShiftBufferRuleController.js
const PlanShiftBufferRule = require('../../models/admin/AdminPlanShiftBufferMapModel.js');


// GET all rules
exports.getAllRules = async (req, res) => {
  try {
    const rules = await PlanShiftBufferRule.findAll();

    if (!rules || rules.length === 0) {
      return res.status(404).json({ message: 'No rules found' });
    }

    return res.status(200).json({ rules });
  } catch (err) {
    console.error('Error in getAllRules:', err);
    return res.status(500).json({ message: 'Server Error', error: err.message });
  }
};


// GET rule by planId
exports.getRuleByPlanId = async (req, res) => {
  try {
    const { planId } = req.params;
    const rule = await PlanShiftBufferRule.findOne({ where: { planId } });
    if (!rule) return res.status(404).json({ message: 'Rule not found' });
    res.json(rule);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST only - Create Rule
exports.createRule = async (req, res) => {
  try {
    const { planId, shiftId, bufferInMinutes } = req.body;
    const adminId = req.user.id; // from auth middleware

    if (!adminId) {
      return res.status(401).json({ message: 'Unauthorized: Admin ID missing from token' });
    }

    if (!planId || !shiftId) {
      return res.status(400).json({ message: 'planId and shiftId are required' });
    }

    const now = new Date();

    const newRule = await PlanShiftBufferRule.create({
      planId,
      shiftId,
      bufferInMinutes,
      adminId,
      createdDate: now,
      updatedDate: now,
    });

    return res.status(201).json({ message: 'Rule created', rule: newRule });
  } catch (err) {
    console.error('Error in createRule:', err);
    return res.status(500).json({ message: 'Server Error', error: err.message });
  }
};



// PATCH bufferInMinutes by rule ID
exports.patchBufferTimeById = async (req, res) => {
  try {
    const { id } = req.params;
    const { bufferInMinutes } = req.body;
    const adminId = req.user.id; // from auth middleware

    if (!adminId) {
      return res.status(401).json({ message: 'Unauthorized: Admin ID missing from token' });
    }

    if (!bufferInMinutes && bufferInMinutes !== 0) {
      return res.status(400).json({ message: 'bufferInMinutes is required' });
    }

    const rule = await PlanShiftBufferRule.findByPk(id);
    if (!rule) {
      return res.status(404).json({ message: 'Rule not found' });
    }

    rule.bufferInMinutes = bufferInMinutes;
    rule.updatedDate = new Date();
    await rule.save();

    return res.json({ message: 'Buffer time updated', rule });
  } catch (err) {
    console.error('Error in patchBufferTimeById:', err);
    return res.status(500).json({ message: 'Server Error', error: err.message });
  }
};
