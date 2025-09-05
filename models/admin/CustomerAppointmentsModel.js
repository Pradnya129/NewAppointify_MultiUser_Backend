const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const Admin = require('../../models/admin/AdminAccountModel.js')

const CustomerAppointment = sequelize.define('CustomerAppointment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },

  clientId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  
    adminId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Admin, // Table name of your admin model
      key: 'id'
    }
  },

  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },

  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { isEmail: true }
  },

  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },

  duration: {
    type: DataTypes.STRING,
    allowNull: false
  },

  appointmentTime: {
    type: DataTypes.STRING,
    allowNull: false
  },

  appointmentDate: {
    type: DataTypes.STRING,
    allowNull: false
  },

  plan: {
    type: DataTypes.STRING,
    allowNull: false
  },

  details: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },

  paymentId: {
    type: DataTypes.STRING,
    allowNull: true
  },

  orderId: {
    type: DataTypes.STRING,
    allowNull: true
  },

  appointmentStatus: {
    type: DataTypes.ENUM('Scheduled', 'Completed', 'Cancelled', 'Rescheduled', 'Pending'),
    defaultValue: 'Pending'
  },

  paymentStatus: {
    type: DataTypes.ENUM('Pending', 'Paid', 'Failed', 'Refunded'),
    defaultValue: 'Pending'
  },

  paymentMethod: {
    type: DataTypes.STRING,
    defaultValue: 'Pending'
  }

}, {
  tableName: 'customer_appointments',
  timestamps: true // adds createdAt and updatedAt
});

module.exports = CustomerAppointment;
