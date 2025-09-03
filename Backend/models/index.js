// models/index.js

const db = require('../config/db.js');

// Import models
const Admin = require('./admin/AdminAccountModel.js');
const AdminSubscription = require('./superAdmin/AdminSubscriptionTrackModel.js');
const SubscriptionPlans = require('./superAdmin/SubscriptionPlanModel.js');
const SubscriptionRenewal = require('./superAdmin/SubscriptionRenewalModel.js');
const Coupon = require('./superAdmin/CouponModel.js');
const NotificationPreference = require('./admin/NotificationPreferenceModel.js');

// ---------------------
// Set up Associations
// ---------------------

// Admin ↔ AdminSubscription
Admin.hasMany(AdminSubscription, { foreignKey: 'adminId', as: 'subscriptions' });
AdminSubscription.belongsTo(Admin, { foreignKey: 'adminId', as: 'admin' });

// SubscriptionPlan ↔ AdminSubscription
SubscriptionPlans.hasMany(AdminSubscription, { foreignKey: 'subscriptionPlanId', as: 'subscriptions' });
AdminSubscription.belongsTo(SubscriptionPlans, { foreignKey: 'subscriptionPlanId', as: 'plan' });

// Admin ↔ SubscriptionRenewal
Admin.hasMany(SubscriptionRenewal, { foreignKey: 'adminId', as: 'renewals' });
SubscriptionRenewal.belongsTo(Admin, { foreignKey: 'adminId', as: 'admin' });

// SubscriptionPlan ↔ SubscriptionRenewal
SubscriptionPlans.hasMany(SubscriptionRenewal, { foreignKey: 'planId', as: 'renewals' });
SubscriptionRenewal.belongsTo(SubscriptionPlans, { foreignKey: 'planId', as: 'plan' });

// AdminSubscription ↔ SubscriptionRenewal
AdminSubscription.hasMany(SubscriptionRenewal, { foreignKey: 'subscriptionPlanId', as: 'renewals' });
SubscriptionRenewal.belongsTo(AdminSubscription, { foreignKey: 'subscriptionPlanId', as: 'subscriptionTrack' });

// Admin ↔ NotificationPreference (1:1 assumed)
Admin.hasOne(NotificationPreference, { foreignKey: 'adminId', as: 'notificationPreference' });
NotificationPreference.belongsTo(Admin, { foreignKey: 'adminId', as: 'admin' });

// If needed: link NotificationPreference to SubscriptionRenewal (optional, based on your logic)
SubscriptionRenewal.belongsTo(NotificationPreference, { foreignKey: 'adminId', as: 'notificationPref' });

// ---------------------
// Export Models
// ---------------------

module.exports = {
  db,
  Admin,
  AdminSubscription,
  SubscriptionPlans,
  SubscriptionRenewal,
  Coupon,
  NotificationPreference,
};
