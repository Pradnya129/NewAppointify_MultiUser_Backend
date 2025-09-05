const Tenant = require('../../models/superAdmin/TenantsModel.js');

// ✅ Create a new tenant with only name (usually from admin signup)
exports.createTenant = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Business name is required' });
    }

    const newTenant = await Tenant.create({ name });

    res.status(201).json({ success: true, tenant: newTenant });
  } catch (error) {
    console.error('Error creating tenant:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update tenant details after signup (complete setup)
exports.updateTenant = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      domain,
      email,
      planId,
      status,
      logoUrl,
      createdBy
    } = req.body;

    const tenant = await Tenant.findByPk(id);
    if (!tenant) {
      return res.status(404).json({ success: false, message: 'Tenant not found' });
    }

    await tenant.update({
      domain,
      email,
      planId,
      status,
      logoUrl,
      createdBy
    });

    res.status(200).json({ success: true, tenant });
  } catch (error) {
    console.error('Error updating tenant:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get all tenants
exports.getAllTenants = async (req, res) => {
  try {
    const tenants = await Tenant.findAll();
    res.status(200).json({ success: true, tenants });
  } catch (error) {
    console.error('Error fetching tenants:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get tenant by ID
exports.getTenantById = async (req, res) => {
  try {
    const { id } = req.params;
    const tenant = await Tenant.findByPk(id);

    if (!tenant) {
      return res.status(404).json({ success: false, message: 'Tenant not found' });
    }

    res.status(200).json({ success: true, tenant });
  } catch (error) {
    console.error('Error fetching tenant:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Delete tenant
exports.deleteTenant = async (req, res) => {
  try {
    const { id } = req.params;

    const tenant = await Tenant.findByPk(id);
    if (!tenant) {
      return res.status(404).json({ success: false, message: 'Tenant not found' });
    }

    await tenant.destroy();
    res.status(200).json({ success: true, message: 'Tenant deleted successfully' });
  } catch (error) {
    console.error('Error deleting tenant:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
