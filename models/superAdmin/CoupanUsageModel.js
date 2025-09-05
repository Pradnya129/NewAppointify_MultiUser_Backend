const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const CouponUsage = sequelize.define('CouponUsage', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  adminId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  couponId: {
    type: DataTypes.UUID,
    allowNull: false
  }
}, {
  tableName: 'coupon_usage',
  timestamps: true
});

module.exports = CouponUsage;

