// models/superAdmin/SubscriptionRenewalModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db.js');
const Admin = require('../admin/AdminAccountModel.js');
const SubscriptionPlan = require('./SubscriptionPlanModel.js');
const AdminSubscription = require('./AdminSubscriptionTrackModel.js');
const NotificationPreference = require('../admin/NotificationPreferenceModel.js')

const AdminSubscriptionRenewal = sequelize.define('AdminSubscriptionRenewal', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  adminId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  planId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  subscriptionPlanId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  couponCode: {
  type: DataTypes.STRING,
  allowNull: true,
},
discountAmount: {
  type: DataTypes.DECIMAL(10, 2),
  allowNull: true,
}
,
  status: {
    type: DataTypes.ENUM('Active', 'Expired', 'Renewed', 'Pending'),
    defaultValue: 'Active'
  }
}, {
  tableName: 'admin_subscription_renewals',
  timestamps: true

  
});



module.exports = AdminSubscriptionRenewal;
