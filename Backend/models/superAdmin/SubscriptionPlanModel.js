const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const SubscriptionPlan = sequelize.define('SubscriptionPlan', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },

  planName: {
    type: DataTypes.STRING,
    allowNull: false
  },

  monthlyPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },

  annualPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },

  renewalLimit: {
    type: DataTypes.INTEGER,
    allowNull: true // null means unlimited
  },

  features: {
    type: DataTypes.TEXT, // comma-separated or JSON string
    allowNull: true
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }

}, {
  tableName: 'subscription_plans',
  timestamps: true
});

module.exports = SubscriptionPlan;
