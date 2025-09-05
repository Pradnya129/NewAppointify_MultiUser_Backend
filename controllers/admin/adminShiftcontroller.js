const AdminShift = require('../../models/admin/AdminShiftModel.js');

// Create a shift
exports.createShift = async (req, res) => {
  try {
    const adminId = req.user.id; // Assuming req.user is set by your auth middleware
    const { name, startTime, endTime } = req.body;

    const shift = await AdminShift.create({
      adminId,
      name,
      startTime,
      endTime
    });

    res.status(201).json(shift);
  } catch (error) {
    res.status(500).json({ message: 'Error creating shift', error });
  }
};

// Get all shifts
exports.getAllShifts = async (req, res) => {
  try {
    const shifts = await AdminShift.findAll();
    res.status(200).json(shifts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching shifts', error });
  }
};

// Get a shift by ID
exports.getShiftById = async (req, res) => {
  try {
    const shift = await AdminShift.findByPk(req.params.id);
    if (!shift) return res.status(404).json({ message: 'Shift not found' });

    res.status(200).json(shift);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving shift', error });
  }
};

// Update a shift
exports.updateShift = async (req, res) => {
  try {
    const { name, startTime, endTime } = req.body;
    const shift = await AdminShift.findByPk(req.params.id);

    if (!shift) return res.status(404).json({ message: 'Shift not found' });

    shift.name = name;
    shift.startTime = startTime;
    shift.endTime = endTime;
    await shift.save();

    res.status(200).json(shift);
  } catch (error) {
    res.status(500).json({ message: 'Error updating shift', error });
  }
};

// Delete a shift
exports.deleteShift = async (req, res) => {
  try {
    const shift = await AdminShift.findByPk(req.params.id);
    if (!shift) return res.status(404).json({ message: 'Shift not found' });

    await shift.destroy();
    res.status(200).json({ message: 'Shift deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting shift', error });
  }
};
