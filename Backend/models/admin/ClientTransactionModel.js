const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const Admin = require('../../models/admin/AdminAccountModel.js')
const CustomerAppointments = require('../../models/admin/CustomerAppointmentsModel.js')
const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },

  adminId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Admin, // Table name of your admin model
      key: 'id'
    }
  },

  clientId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: CustomerAppointments, // Update this to your actual client model's table name
      key: 'id'
    }
  },

  // Optional - cached fields for display
  email: {
    type: DataTypes.STRING,
    allowNull: true
  },

  username: {
    type: DataTypes.STRING,
    allowNull: true
  },

  plan: {
    type: DataTypes.STRING,
    allowNull: true // OR you can make this a planId FK if you want normalization
  },

  start: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },

  end: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },

  totalPaid: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },

  provider: {
    type: DataTypes.STRING,
    allowNull: true // Example: Razorpay, Stripe
  },

  status: {
    type: DataTypes.ENUM('Completed', 'Pending', 'Failed', 'Refunded'),
    defaultValue: 'Completed'
  }

}, {
  tableName: 'client_transactions',
  timestamps: true
});

module.exports = Transaction;
