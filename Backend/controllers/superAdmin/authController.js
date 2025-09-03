const SuperAdmin = require('../../models/superAdmin/SuperAdminAccountModel.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



// 🔐 Super Admin Login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const superAdmin = await SuperAdmin.findOne({ where: { email } });
    if (!superAdmin) {
      return res.status(404).json({ message: 'Super Admin not found' });
    }

    const match = await bcrypt.compare(password, superAdmin.passwordHash);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      {
        id: superAdmin.id,
        role: superAdmin.role   // ✅ Corrected this line
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, user: superAdmin });
  } catch (err) {
    next(err);
  }
};

// 🛠️ Optional: Create Super Admin
exports.register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, phoneNumber } = req.body;
    console.log('📥 Request body:', req.body); 

    const existing = await SuperAdmin.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: 'Super Admin already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const superAdmin = await SuperAdmin.create({
      firstName,
      lastName,
      email,
      passwordHash,
      phoneNumber,
      role: 'superadmin'
    });

    const token = jwt.sign(
      { id: superAdmin.id, role: 'superadmin' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({ token, user: superAdmin });
  } catch (err) {
    console.error('❌ Error in SuperAdmin register:', err);
    next(err);
  }
};


// DELETE /api/superadmin/delete
exports.deleteAccount = async (req, res, next) => {
  try {
    const { id } = req.user;

    const deleted = await SuperAdmin.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: 'Super Admin not found' });

    res.json({ message: 'Super Admin account deleted' });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/superadmin/change-password
exports.changePassword = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { oldPassword, newPassword } = req.body;

    const user = await SuperAdmin.findByPk(id);
    if (!user) return res.status(404).json({ message: 'Super Admin not found' });

    const match = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!match) return res.status(401).json({ message: 'Old password is incorrect' });

    const newHash = await bcrypt.hash(newPassword, 10);
    await SuperAdmin.update({ passwordHash: newHash }, { where: { id } });

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    next(err);
  }
};

// PUT /api/superadmin/update
exports.updateProfile = async (req, res, next) => {
  try {
    const { id } = req.user; // from JWT token
    const { firstName, lastName, phoneNumber } = req.body;

    const updated = await SuperAdmin.update(
      { firstName, lastName, phoneNumber },
      { where: { id } }
    );

    if (updated[0] === 0) return res.status(404).json({ message: 'Super Admin not found or unchanged' });

    const user = await SuperAdmin.findByPk(id);
    res.json({ message: 'Profile updated successfully', user });
  } catch (err) {
    next(err);
  }
};
