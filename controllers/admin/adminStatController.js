const AdminStat = require('../../models/admin/AdminStatsModel.js');

// ✅ GET all stats for the logged-in admin
// API to fetch admin-specific stats
exports.getAllStats = async (req, res) => {
  try {
    const adminId = req.user?.id;
    const tenantId = req.user?.tenantId;

    if (!adminId || !tenantId) {
      return res.status(400).json({ message: 'Invalid token: Admin ID or Tenant ID missing' });
    }

    const stats = await AdminStat.findAll({
      where: {
        adminId,
        tenantId, // ensures multi-tenant isolation
      },
      order: [['createdAt', 'DESC']], // optional: sort by newest
    });

    res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
};

// ✅ GET stat by ID but restricted to that admin
exports.getStatById = async (req, res) => {
  try {
    const adminId = req.user?.id;
    if (!adminId) {
      return res.status(400).json({ message: 'Admin ID missing from token' });
    }

    const stat = await AdminStat.findOne({
      where: { id: req.params.id, adminId }
    });

    if (!stat) return res.status(404).json({ message: 'Stat not found for this admin' });

    res.status(200).json(stat);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stat', error });
  }
};

// ✅ Create stat (already admin-specific)
exports.createStat = async (req, res) => {
  try {
    const adminId = req.user?.id; // get adminId from token
    const { value, description, icon } = req.body;

    if (!adminId) {
      return res.status(400).json({ message: 'Admin ID missing from token' });
    }

    const stat = await AdminStat.create({ adminId, value, description, icon });
    res.status(201).json(stat);
  } catch (error) {
    res.status(500).json({ message: 'Error creating stat', error });
  }
};

// ✅ Update stat (only if it belongs to the admin)
exports.updateStat = async (req, res) => {
  try {
    const adminId = req.user?.id;
    const { value, description, icon } = req.body;

    const stat = await AdminStat.findOne({
      where: { id: req.params.id, adminId }
    });

    if (!stat) return res.status(404).json({ message: 'Stat not found for this admin' });

    await stat.update({ value, description, icon });
    res.status(200).json(stat);
  } catch (error) {
    res.status(500).json({ message: 'Error updating stat', error });
  }
};

// ✅ Delete stat (only if it belongs to the admin)
exports.deleteStat = async (req, res) => {
  try {
    const adminId = req.user?.id;

    const stat = await AdminStat.findOne({
      where: { id: req.params.id, adminId }
    });

    if (!stat) return res.status(404).json({ message: 'Stat not found for this admin' });

    await stat.destroy();
    res.status(200).json({ message: 'Stat deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting stat', error });
  }
};
