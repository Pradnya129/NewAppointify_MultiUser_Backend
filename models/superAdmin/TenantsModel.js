const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Tenant = sequelize.define('Tenant', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false
  },

  domain: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },

  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: { isEmail: true }
  },

  planId: {
    type: DataTypes.INTEGER,
    allowNull: true  // Will link to subscription plan table if used
  },

  status: {
    type: DataTypes.ENUM('active', 'inactive', 'suspended','pending'),
    defaultValue: 'active'
  },

  logoUrl: {
    type: DataTypes.STRING,
    allowNull: true  // Optional: logo for landing page
  },

  createdBy: {
    type: DataTypes.UUID,
    allowNull: true  // Optional: superAdminId who created the tenant
  }

}, {
  tableName: 'tenants',
  timestamps: true
});

module.exports = Tenant;
