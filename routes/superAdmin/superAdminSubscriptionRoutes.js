const express = require('express');
const router = express.Router();
const controller = require('../../controllers/superAdmin/subscriptionController.js');
const authMiddleware = require('../../middleware/authMiddleware.js');
const roleMiddleware = require('../../middleware/roleMiddleware.js');
const SuperAdmin = require('../../models/superAdmin/SuperAdminAccountModel.js');

// Plan routes
router.get('/all', authMiddleware, roleMiddleware(['admin', 'superadmin']), controller.getAllPlans);
router.get('/:id',authMiddleware, roleMiddleware(['admin', 'superadmin']),controller.getPlanById);
router.post('/add',authMiddleware,roleMiddleware(['admin', 'superadmin']), controller.createPlan);
router.patch('/:id',authMiddleware, roleMiddleware(['admin', 'superadmin']),controller.updatePlan);
router.delete('/:id',authMiddleware,roleMiddleware(['admin', 'superadmin']), controller.deletePlan);

// Admin subscription routes
router.post('/subscriptions/add',authMiddleware,roleMiddleware(['superAdmin']), controller.assignSubscription);
router.get('/subscriptions/all',authMiddleware,roleMiddleware(['superadmin']), controller.getAllAdminSubscriptions);
router.get('/subscriptions/:adminId',authMiddleware,roleMiddleware(['admin', 'superAdmin']), controller.getAdminSubscriptions);
router.patch('/subscriptions/:id',authMiddleware,roleMiddleware(['superAdmin']), controller.updateSubscription);
module.exports = router;
