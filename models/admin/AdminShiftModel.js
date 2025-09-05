const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const Admin = require('../../models/admin/AdminAccountModel.js')
const AdminShift = sequelize.define('AdminShift', {
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
    },
    onDelete: 'CASCADE'
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false
  },

  startTime: {
    type: DataTypes.TIME,
    allowNull: false
  },

  endTime: {
    type: DataTypes.TIME,
    allowNull: false
  }

}, {
  tableName: 'admin_shifts',
  timestamps: true // Adds createdAt and updatedAt automatically
});

module.exports = AdminShift;
