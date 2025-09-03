const AdminStat = require('../../models/admin/AdminStatsModel.js');

// GET all stats
exports.getAllStats = async (req, res) => {
  try {
    const stats = await AdminStat.findAll();
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error });
  }
};

// GET stat by ID
exports.getStatById = async (req, res) => {
  try {
    const stat = await AdminStat.findByPk(req.params.id);
    if (!stat) return res.status(404).json({ message: 'Stat not found' });

    res.status(200).json(stat);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stat', error });
  }
};

exports.createStat = async (req, res) => {
  try {
    const adminId = req.user?.id; // get adminId from the authenticated user
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


// PUT - update a stat
exports.updateStat = async (req, res) => {
  try {
    const { value, description, icon } = req.body;
    const stat = await AdminStat.findByPk(req.params.id);
    if (!stat) return res.status(404).json({ message: 'Stat not found' });

    await stat.update({ value, description, icon });
    res.status(200).json(stat);
  } catch (error) {
    res.status(500).json({ message: 'Error updating stat', error });
  }
};

// DELETE - delete a stat
exports.deleteStat = async (req, res) => {
  try {
    const stat = await AdminStat.findByPk(req.params.id);
    if (!stat) return res.status(404).json({ message: 'Stat not found' });

    await stat.destroy();
    res.status(200).json({ message: 'Stat deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting stat', error });
  }
};
