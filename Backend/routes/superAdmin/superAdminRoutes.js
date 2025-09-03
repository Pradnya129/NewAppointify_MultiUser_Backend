const express = require('express');
const router = express.Router();
const authController = require('../../controllers/superAdmin/authController.js');
const authMiddleware = require('../../middleware/authMiddleware.js');
const roleMiddleware = require('../../middleware/roleMiddleware.js');

// Only for initial seeding — disable later
router.post('/register', authController.register);

// Login route
router.post('/login', authController.login);
router.put('/update', authMiddleware, roleMiddleware('superadmin'), authController.updateProfile);
router.delete('/delete', authMiddleware, roleMiddleware('superadmin'), authController.deleteAccount);
router.patch('/change-password', authMiddleware, roleMiddleware('superadmin'), authController.changePassword);
module.exports = router;
