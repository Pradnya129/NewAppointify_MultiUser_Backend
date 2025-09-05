const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/superAdmin/manageAdminController.js');
const authMiddleware = require('../../middleware/authMiddleware.js');
const roleMiddleware = require('../../middleware/roleMiddleware.js');


// Add routes (you can add `isSuperAdmin` if needed)
router.post('/manageAdmins/',authMiddleware, roleMiddleware('superadmin'), adminController.createAdmin);
router.get('/manageAdmins/',authMiddleware, roleMiddleware('superadmin'), adminController.getAllAdmins);
router.get('/manageAdmins/:id',authMiddleware, roleMiddleware('superadmin'), adminController.getAdminById);
router.put('/manageAdmins/:id',authMiddleware, roleMiddleware('superadmin'), adminController.updateAdmin);
router.delete('/manageAdmins/:id',authMiddleware, roleMiddleware('superadmin'), adminController.deleteAdmin);

module.exports = router;
