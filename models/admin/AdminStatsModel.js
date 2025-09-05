const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const Admin = require('../../models/admin/AdminAccountModel.js')
const AdminStat = sequelize.define('AdminStat', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
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

  value: {
    type: DataTypes.DECIMAL(5, 2), // e.g. 95.75
    allowNull: false
  },

  description: {
    type: DataTypes.STRING,
    allowNull: false
  },

  icon: {
    type: DataTypes.STRING,
    allowNull: true // e.g. "up", "down", or custom CSS class
  }

}, {
  tableName: 'admin_stats',
  timestamps: true
});

module.exports = AdminStat;
