const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
  const Coupon = sequelize.define("Coupon", {
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    discountType: {
      type: DataTypes.ENUM('percentage', 'fixed'),
      allowNull: false,
    },
    discountValue: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    maxUsage: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    usedCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });

module.exports = Coupon;