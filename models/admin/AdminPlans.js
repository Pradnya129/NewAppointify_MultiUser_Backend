const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db.js');
const Admin = require('./AdminAccountModel.js')
const AdminPlan = sequelize.define('AdminPlan', {
  planId: {
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
    },
    onDelete: 'CASCADE'
  },

  planName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },

  planPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },

  planDuration: {
    type: DataTypes.STRING(50),
    allowNull: false
  },

  planDescription: {
    type: DataTypes.TEXT,
    allowNull: false
  },

  // planFeatures: {
  //   type: DataTypes.TEXT, // Can be comma-separated or JSON (optional to parse later)
  //   allowNull: false
  // },
  planFeatures: {
  type: DataTypes.JSON, // [{feature: 'Video calls'}, {feature: 'Support'}]
  allowNull: false
}


}, {
  tableName: 'admin_plans',
  timestamps: true // will auto-add createdAt and updatedAt
});

module.exports = AdminPlan;
