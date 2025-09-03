const Admin = require('../../models/admin/AdminAccountModel.js');
const Tenant = require('../../models/superAdmin/TenantsModel.js');
const SuperAdmin = require("../../models/superAdmin/SuperAdminAccountModel.js")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register new admin
exports.register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, businessName, phoneNumber } = req.body;

    const existing = await Admin.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    // 🏢 Create tenant first
const tenant = await Tenant.create({
  name: businessName,
  status: 'inactive',
  createdBy: email,
  domain: `${businessName.toLowerCase().replace(/\s+/g, '')}.com`, // or anything valid
  email: email // or a separate field for tenant email if needed
});


    const hash = await bcrypt.hash(password, 10);
    const newAdmin = await Admin.create({
      firstName,
      lastName,
      email,
      passwordHash: hash,
      phoneNumber,
      tenantId: tenant.id,
      businessName // if still keeping it on admin
    });

    const token = jwt.sign(
      { id: newAdmin.id,
         role: newAdmin.role,
        tenantId: newAdmin.tenantId 
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({ token, user: newAdmin });
  }catch (err) {
  console.error('Admin registration error:', err); // 👈 add this
  res.status(500).json({ message: 'Server error', error: err.message });
}

};


// Login admin


// 🔐 Unified Login API
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    let user = null;
    let role = null;

    // 🔎 First check SuperAdmin table
    user = await SuperAdmin.findOne({ where: { email } });
    if (user) {
      role = "superadmin";
    } else {
      // 🔎 If not found, check Admin table
      user = await Admin.findOne({ where: { email } });
      if (user) {
        role = "admin";
      }
    }

    // ❌ No user found
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔑 Check password
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 🎫 Generate JWT
    const tokenPayload = { id: user.id, role };
    if (role === "admin") {
      tokenPayload.tenantId = user.tenantId; // extra field for admins
    }

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role,
        ...(role === "admin" && { tenantId: user.tenantId }),
      },
    });
  } catch (err) {
    next(err);
  }
};

