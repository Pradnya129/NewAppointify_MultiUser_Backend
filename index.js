const express = require('express');
const cors = require('cors');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const errorHandler = require('./middleware/errorHandler.js');
require('./jobs/renewalReminderJob.js');
require('./jobs/appointmentRemainderCron.js'); // make sure path is correct

const {
  db,
  Admin,
  AdminSubscription,
  SubscriptionPlans,
  SubscriptionRenewal,
  Coupon,
  NotificationPreference
} = require('./models'); // ⬅️ Import all models and db here

// Routes
const superAdminRoutes = require('./routes/superAdmin/superAdminRoutes.js');
const adminRoutes = require('./routes/admin/adminRoutes.js');
const landingRoutes = require('./routes/admin/landingRoutes.js');
const customerAppointmentsRoutes = require('./routes/admin/customerAppointments.js');
const adminPlanRoutes = require('./routes/admin/adminPlanRoutes.js');
const adminFaqRoutes = require('./routes/admin/faqRoutes.js');
const adminStatRoutes = require('./routes/admin/adminStatRoutes.js');
const adminShiftRoutes = require('./routes/admin/adminShiftRoutes.js');
const planShiftRoutes = require('./routes/admin/adminPlanShiftBufferMapRoutes.js');
const SA_sub_Routes = require('./routes/superAdmin/superAdminSubscriptionRoutes.js');
const Admin_sub_Routes = require('./routes/admin/adminSubscribeRoutes.js');
const manageAdminRoutes = require('./routes/superAdmin/manageAdminRoutes.js');
const subscriptionRenewalRoutes = require('./routes/superAdmin/subscriptionRenewalRoutes.js');
const notificationRoutes = require('./routes/admin/adminNotificationPreferenceRoutes.js');
const couponRoutes = require('./routes/superAdmin/coupanRoutes.js');
const tenantRoutes = require('./routes/superAdmin/tenantRoutes.js');

// ✅ Ensure upload directories exist
const landingPath = path.join(__dirname, 'public', 'uploads', 'landing');
const section2Path = path.join(__dirname, 'public', 'uploads', 'section2Image');

[landingPath, section2Path].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(errorHandler); // Global error handler

// ✅ Serve all uploads (landing + section2Image)
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// Routes
app.use('/api/superadmin', superAdminRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/landing', landingRoutes);
app.use('/api/customer-appointments', customerAppointmentsRoutes);
app.use('/api/admin/plans', adminPlanRoutes);
app.use('/api/admin/faq', adminFaqRoutes);
app.use('/api/admin/stats', adminStatRoutes);
app.use('/api/admin/shift', adminShiftRoutes);
app.use('/api/plan-shift-buffer-rule', planShiftRoutes);
app.use('/api/superAdmin/sub_plans', SA_sub_Routes);
app.use('/api/admin/sub_plans', Admin_sub_Routes);
app.use('/api/superadmin', manageAdminRoutes);
app.use('/api/superadmin/renewals', subscriptionRenewalRoutes);
app.use('/api/admin/notification', notificationRoutes);
app.use('/api/superadmin/coupons', couponRoutes);
app.use('/api/superadmin/tenants', tenantRoutes);

// Default route
app.get('/', (req, res) => {
  res.send("hello world");
});

// Sync DB
db.sync()
  .then(() => console.log('✅ Database synced'))
  .catch((err) => console.error('❌ Sync error:', err));

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
