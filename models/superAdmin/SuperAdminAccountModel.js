const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db.js');

const SuperAdmin = sequelize.define('SuperAdmin', {
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

  userName: {
    type: DataTypes.STRING(256),
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

role: {
  type: DataTypes.ENUM('admin', 'superadmin'),
  defaultValue: 'superadmin'
}

}, {
  tableName: 'super_adminAccount',
  timestamps: true, // ⏱️ Automatically adds `createdAt` and `updatedAt`
});

module.exports = SuperAdmin;
