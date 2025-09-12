const Admin = require('../../models/admin/AdminAccountModel.js');
const AdminSubscriptionRenewal = require('../../models/superAdmin/SubscriptionRenewalModel.js');
const CustomerAppointment = require('../../models/admin/CustomerAppointmentsModel.js');
const Tenant = require('../../models/superAdmin/TenantsModel.js'); // import Tenant

const bcrypt = require('bcrypt');

// 🆕 Create Admin
exports.createAdmin = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phoneNumber, userName, businessName, role } = req.body;

    // Auto-create tenant for this admin
    const tenant = await Tenant.create({
      name: businessName || `${firstName} ${lastName}'s Business`,
      domain: `${firstName.toLowerCase()}.${Date.now()}.com`, // generate unique domain
      email: email,
      status: 'active',
      createdBy: null
    });

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      userName,
      businessName,
      passwordHash,
      tenantId: tenant.id, // assign the new tenant id
      role: role || 'admin'
    });

    res.status(201).json({ message: 'Admin created', admin });
  } catch (error) {
    console.error('Create Admin Error:', error);
    res.status(500).json({ error: 'Failed to create admin', details: error.message });
  }
};

// 📃 Get All Admins
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.findAll({ order: [['createdAt', 'DESC']] });
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch admins', details: error.message });
  }
};

// 🔍 Get Single Admin by ID
exports.getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.params.id);
    if (!admin) return res.status(404).json({ error: 'Admin not found' });
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch admin', details: error.message });
  }
};

// ✏️ Update Admin
exports.updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (updateData.password) {
      updateData.passwordHash = await bcrypt.hash(updateData.password, 10);
      delete updateData.password;
    }

    const [updated] = await Admin.update(updateData, { where: { id } });

    if (!updated) return res.status(404).json({ error: 'Admin not found or nothing to update' });

    const updatedAdmin = await Admin.findByPk(id);
    res.status(200).json({ message: 'Admin updated', admin: updatedAdmin });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update admin', details: error.message });
  }
};

// ❌ Delete Admin
exports.deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Check if admin exists
    const admin = await Admin.findByPk(id);
    if (!admin) return res.status(404).json({ error: "Admin not found" });

    // 2️⃣ Delete related renewals
    await AdminSubscriptionRenewal.destroy({ where: { adminId: id } });

    // 3️⃣ Delete related customer appointments
    await CustomerAppointment.destroy({ where: { adminId: id } });

    // 4️⃣ Delete the admin
    await Admin.destroy({ where: { id } });

    res.status(200).json({ message: "Admin and related data deleted successfully" });
  } catch (error) {
    console.error("❌ Delete Admin Error:", error);
    res.status(500).json({ error: "Failed to delete admin", details: error.message });
  }
};

