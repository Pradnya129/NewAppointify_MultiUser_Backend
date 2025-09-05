const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const SubscriptionRenewal= require('../superAdmin/SubscriptionRenewalModel.js')
const NotificationPreference = require('../admin/NotificationPreferenceModel.js')
const Admin = sequelize.define('Admin', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
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
    type: DataTypes.STRING(256),
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
role: {
  type: DataTypes.ENUM('admin', 'superadmin'),
  defaultValue: 'admin'
},
  userName: {
    type: DataTypes.STRING(256),
    allowNull: true
  },


  businessName: {
    type: DataTypes.STRING,
    allowNull: true
  },

  passwordHash: {
    type: DataTypes.TEXT,
    allowNull: false
  },

  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },

  tenantId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }

}, {
  tableName: 'admins_account',
  timestamps: true
});
Admin.hasOne(SubscriptionRenewal, { foreignKey: 'adminId' });
Admin.hasOne(NotificationPreference, { foreignKey: 'adminId' });

module.exports = Admin;
