const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const Admin = require('../../models/admin/AdminAccountModel.js');

const NotificationPreference = sequelize.define(
  'NotificationPreference',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    adminId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Admin,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    // Notification flags
    daysBefore30: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    daysBefore15: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    daysBefore7: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    overdue: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: 'notification_preferences',
    timestamps: true,
  }
);

// Proper association using alias (fixes 'alias mismatch' issue)
NotificationPreference.associate = function (models) {
  NotificationPreference.belongsTo(models.Admin, {
    foreignKey: 'adminId',
    as: 'admin',
  });
};

module.exports = NotificationPreference;
