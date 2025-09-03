const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const Admin = require('../../models/admin/AdminAccountModel.js')
const AdminShifts = require('../../models/admin/AdminShiftModel.js')
const AdminPlans = require('./AdminPlans.js')
const PlanShiftBufferRule = sequelize.define('AdminPlanShiftBufferMapModel', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },

  planId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: AdminPlans,
      key: 'planId'
    },
    onDelete: 'CASCADE'
  },

  shiftId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: AdminShifts,
      key: 'id'
    },
    onDelete: 'CASCADE'
  },

  bufferInMinutes: {
    type: DataTypes.INTEGER,
    allowNull: false
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

}, {
  tableName: 'admin_plan_shift_buffer_map',
  timestamps: true
});

module.exports = PlanShiftBufferRule;
