const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const Admin = require('../../models/admin/AdminAccountModel.js')
const SubscriptionRenewals= require('./SubscriptionRenewalModel.js')
const PaymentTransaction = sequelize.define('PaymentTransaction', {
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
  transactionId: {
    type: DataTypes.STRING,
    allowNull: false
  },

  provider: {
    type: DataTypes.STRING,
    allowNull: false // e.g., 'Razorpay', 'Stripe'
  },

  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },

  currency: {
    type: DataTypes.STRING,
    defaultValue: 'INR'
  },

  status: {
    type: DataTypes.ENUM('Pending', 'Paid', 'Failed', 'Refunded'),
    allowNull: false
  },

  type: {
    type: DataTypes.STRING,
    allowNull: false // e.g., 'AdminSubscription'
  },
  renewalId: {
  type: DataTypes.UUID,
  allowNull: true,
  references: {
    model: SubscriptionRenewals,
    key: 'id'
  }
},


}, {
  tableName: 'adminpayment_transactions',
  timestamps: true
});

module.exports = PaymentTransaction;
