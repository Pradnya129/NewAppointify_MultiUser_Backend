const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const Admin = require('../../models/admin/AdminAccountModel.js')
const Faq = sequelize.define('Faq', {
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

  question: {
    type: DataTypes.STRING,
    allowNull: false
  },

  answer: {
    type: DataTypes.TEXT,
    allowNull: false
  }

}, {
  tableName: 'faqs',
  timestamps: true
});

module.exports = Faq;
