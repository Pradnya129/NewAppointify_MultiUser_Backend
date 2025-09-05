// routes/admin/adminRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../../controllers/admin/authController.js');
const errorHandler = require('../../middleware/errorHandler.js');

// ✅ Register Admin (tenant + admin will be created here)
router.post('/register',errorHandler, authController.register);

// ✅ Admin Login
router.post('/login',errorHandler,authController.login);

// (Optional) Add more admin routes below

module.exports = router;
