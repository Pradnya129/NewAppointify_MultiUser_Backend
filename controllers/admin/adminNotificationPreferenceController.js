const  NotificationPreference  = require('../../models/admin/NotificationPreferenceModel.js'); // Make sure index.js exports all models
const Admin = require('../../models/admin/AdminAccountModel.js');
const sendAppointmentEmail  = require('../../utils/email.js');


// Create or update notification preference 
exports.setPreference = async (req, res) => {
  try {
    const { adminId, daysBefore30, daysBefore15, daysBefore7, overdue } = req.body;

    const admin = await Admin.findByPk(adminId);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Check if a preference already exists for this admin
    const existingPreference = await NotificationPreference.findOne({ where: { adminId } });

    let message = '';
    let preference;

    if (existingPreference) {
      // Update existing preference
      await NotificationPreference.update(
        { daysBefore30, daysBefore15, daysBefore7, overdue },
        { where: { adminId } }
      );
      preference = await NotificationPreference.findOne({ where: { adminId } });
      message = 'Preference updated';
    } else {
      // Create new preference
      preference = await NotificationPreference.create({
        adminId,
        daysBefore30,
        daysBefore15,
        daysBefore7,
        overdue
      });
      message = 'Preference created';
    }

    // ✉️ Send email to admin
    const emailSubject = 'Notification Preferences Updated';
    const emailBody = `
      Hello ${admin.firstName} ${admin.lastName},
<br/>
      Your notification preferences have been ${message.toLowerCase()}.<br/>

      ✅ 30 Days Before: ${daysBefore30 ? 'Enabled' : 'Disabled'}<br/>
      ✅ 15 Days Before: ${daysBefore15 ? 'Enabled' : 'Disabled'}<br/>
      ✅ 7 Days Before: ${daysBefore7 ? 'Enabled' : 'Disabled'}<br/>
      ✅ Overdue: ${overdue ? 'Enabled' : 'Disabled'}

      Regards,
      Renewal Management System
    `;

    await sendAppointmentEmail(admin.email, emailSubject, emailBody);

    res.status(200).json({
      message,
      data: preference
    });

  } catch (error) {
    console.error('Error setting notification preference:', error);
    res.status(500).json({ error: 'Internal server error',message:error.message });
  }
};



// Get preferences for a specific admin
exports.getPreferenceByAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;
    console.log('Admin ID:', adminId); // Log adminId to see what is received

    const preference = await NotificationPreference.findOne({
      where: { adminId }
    });

    if (!preference) {
      return res.status(404).json({ message: 'Preferences not found' });
    }

    res.status(200).json(preference);
  } catch (error) {
    console.error('Error fetching preferences:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};


// Delete preference by preferenceId
exports.deletePreferenceById = async (req, res) => {
  try {
    const { preferenceId } = req.params;

    const deleted = await NotificationPreference.destroy({
      where: { id: preferenceId }
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Preference not found' });
    }

    res.status(200).json({ message: 'Preference deleted successfully' });
  } catch (error) {
    console.error('Error deleting preference:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



// PATCH /admin/notification-preferences/:adminId
exports.updatePreference = async (req, res) => {
  try {
    const { adminId } = req.params;
    const { daysBefore30, daysBefore15, daysBefore7, overdue } = req.body;

    const preference = await NotificationPreference.findOne({ where: { adminId } });
    const admin = await Admin.findByPk(adminId);

    if (!preference || !admin) {
      return res.status(404).json({ message: 'Notification preference or admin not found' });
    }

    // Only update fields if they are provided in the request
    if (typeof daysBefore30 === 'boolean') preference.daysBefore30 = daysBefore30;
    if (typeof daysBefore15 === 'boolean') preference.daysBefore15 = daysBefore15;
    if (typeof daysBefore7 === 'boolean') preference.daysBefore7 = daysBefore7;
    if (typeof overdue === 'boolean') preference.overdue = overdue;

    await preference.save();

    // ✉️ Send email to admin
    const emailSubject = 'Notification Preferences Updated';
    const emailBody = `
      Hello ${admin.firstName} ${admin.lastName},

      Your notification preferences have been updated.

      ✅ 30 Days Before: ${preference.daysBefore30 ? 'Enabled' : 'Disabled'}
      ✅ 15 Days Before: ${preference.daysBefore15 ? 'Enabled' : 'Disabled'}
      ✅ 7 Days Before: ${preference.daysBefore7 ? 'Enabled' : 'Disabled'}
      ✅ Overdue: ${preference.overdue ? 'Enabled' : 'Disabled'}

      Regards,
      Renewal Management System
    `;

    await sendAppointmentEmail(admin.email, emailSubject, emailBody);

    res.status(200).json({
      message: 'Notification preferences updated successfully',
      data: preference
    });

  } catch (error) {
    console.error('Error updating notification preference:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};


