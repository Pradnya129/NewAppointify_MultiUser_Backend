const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const Admin = require('../../models/admin/AdminAccountModel.js')
const LandingPageData = sequelize.define('LandingPageData', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },

  adminId: {
    type: DataTypes.UUID,
    allowNull: false
  },

  fullName: { type: DataTypes.STRING, allowNull: true },
  role: { type: DataTypes.STRING, allowNull: true },
  locationURL: { type: DataTypes.STRING, allowNull: true },
  joinDate: { type: DataTypes.DATE, allowNull: true },
  countries: { type: DataTypes.STRING, allowNull: true },
  languages: { type: DataTypes.STRING, allowNull: true },
  hospitalClinicAddress: { type: DataTypes.STRING, allowNull: true },

  profileImage: { type: DataTypes.STRING, allowNull: true },

  email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: { isEmail: true }
  },
  // Location embed iframe (e.g., Google Maps)
locationIframeURL: {
  type: DataTypes.STRING,
  allowNull: true
},


  experience: { type: DataTypes.STRING, allowNull: true },
  facebookId: { type: DataTypes.STRING, allowNull: true },
  instagramId: { type: DataTypes.STRING, allowNull: true },
  twitterId: { type: DataTypes.STRING, allowNull: true },
  youtubeId: { type: DataTypes.STRING, allowNull: true },

  tagline1: { type: DataTypes.STRING, allowNull: true },
  tagline2: { type: DataTypes.STRING, allowNull: true },
  tagline3: { type: DataTypes.STRING, allowNull: true },

  section2_Tagline: { type: DataTypes.STRING, allowNull: true },
  section3_Tagline: { type: DataTypes.STRING, allowNull: true },

  certificates: { type: DataTypes.STRING, allowNull: true },
  section2_Image: { type: DataTypes.STRING, allowNull: true },
  section3_Image: { type: DataTypes.STRING, allowNull: true },
  description: { type: DataTypes.TEXT, allowNull: true },
  section3_Description: { type: DataTypes.TEXT, allowNull: true },
   section5_Tagline: { type: DataTypes.STRING, allowNull: true },
  section5_MainHeading: { type: DataTypes.STRING, allowNull: true },
  section5_MainDescription: { type: DataTypes.TEXT, allowNull: true },
}, {
  tableName: 'Landing_Page',
  timestamps: true
});

// Define associations
LandingPageData.belongsTo(Admin, { foreignKey: 'adminId', onDelete: 'CASCADE', constraintName: 'fk_landing_page_admin_id' });

module.exports = LandingPageData;
