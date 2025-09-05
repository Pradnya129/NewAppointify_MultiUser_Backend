// models/admin/RenewalModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const Admin = require('../../models/admin/AdminAccountModel.js')
const Adminplans = require('../../models/admin/AdminPlans.js')
const Renewal = sequelize.define('Renewal', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  clientName: DataTypes.STRING,
  companyName: DataTypes.STRING,

  planId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'admin_plans',
      key: 'planId'
    },
    onDelete: 'CASCADE'
  },

  adminId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Admin,
      key: 'id'
    },
    onDelete: 'CASCADE'
  },

  duration: DataTypes.STRING,
  startDate: DataTypes.DATEONLY,
  endDate: DataTypes.DATEONLY,
  amount: DataTypes.DECIMAL(10, 2),
  status: {
    type: DataTypes.ENUM('Paid','Pending'),
    defaultValue: 'Pending'
  },
  description: DataTypes.TEXT
}, {
  tableName: 'renewals',
  timestamps: true
});

module.exports = Renewal;
