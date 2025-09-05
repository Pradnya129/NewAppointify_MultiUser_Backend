const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const Admin = require('../../models/admin/AdminAccountModel.js')
const SubscriptionPlans = require('../../models/superAdmin/SubscriptionPlanModel.js')
const AdminSubscription = sequelize.define('AdminSubscription', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },

  adminId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Admin,
      key: 'id'
    }
  },

  subscriptionPlanId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: SubscriptionPlans,
      key: 'id'
    }
  },

  startDate: {
    type: DataTypes.DATE,
    allowNull: false
  },

  endDate: {
    type: DataTypes.DATE,
    allowNull: false
  },

  paymentStatus: {
    type: DataTypes.ENUM('Pending', 'Paid', 'Failed'),
    defaultValue: 'Pending'
  },

  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  

}, {
  tableName: 'admin_subscriptions_Track',
  timestamps: true
});

module.exports = AdminSubscription;
