const express = require('express');
const router = express.Router();
const tenantController = require('../../controllers/superAdmin/tenantController.js');
const authMiddleware = require('../../middleware/authMiddleware.js');
const roleMiddleware = require('../../middleware/roleMiddleware.js');

router.post('/',authMiddleware,roleMiddleware('admin,superadmin'), tenantController.createTenant);
router.get('/all',authMiddleware ,roleMiddleware('admin'),tenantController.getAllTenants);
router.get('/:id',authMiddleware,roleMiddleware('admin'), tenantController.getTenantById);
router.put('/update/:id',authMiddleware,roleMiddleware('admin'), tenantController.updateTenant);
router.delete('/delete/:id',authMiddleware,roleMiddleware('admin'), tenantController.deleteTenant);

module.exports = router;
