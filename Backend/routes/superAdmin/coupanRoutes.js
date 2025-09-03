// routes/superAdmin/couponRoutes.js
const express = require('express');
const router = express.Router();
const couponController = require('../../controllers/superAdmin/couponApplyController.js');
const authMiddleware = require('../../middleware/authMiddleware.js');
const roleMiddleware = require('../../middleware/roleMiddleware.js');
// ✅ CRUD Endpoints
router.post('/',authMiddleware, roleMiddleware('superadmin'), couponController.createCoupon);          // Create
router.get('/', authMiddleware, roleMiddleware('superadmin'),couponController.getAllCoupons);          // Get all
router.get('/:id',authMiddleware, roleMiddleware('superadmin'), couponController.getCouponById);       // Get one
router.patch('/:id',authMiddleware, roleMiddleware('superadmin'), couponController.updateCoupon);        // Update
router.delete('/:id', authMiddleware, roleMiddleware('superadmin'),couponController.deleteCoupon);     // Delete
router.post('/validate', authMiddleware, roleMiddleware('superadmin'),couponController.validateCoupon);
module.exports = router;
