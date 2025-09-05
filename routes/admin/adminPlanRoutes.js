const express = require('express');
const router = express.Router();
const adminPlanController = require('../../controllers/admin/adminPlanController.js');
const authMiddleware = require('../../middleware/authMiddleware.js');
const roleMiddleware = require('../../middleware/roleMiddleware.js');
const errorHandler = require('../../middleware/errorHandler.js');

// All routes protected with both middlewares
router.post('/', authMiddleware,errorHandler, roleMiddleware('admin'), adminPlanController.createPlan);
router.get('/all', authMiddleware,errorHandler, roleMiddleware('admin'), adminPlanController.getAllPlans);
router.get('/name/:planName', authMiddleware,errorHandler, roleMiddleware('admin'), adminPlanController.getPlansByName);
router.put('/:planId', authMiddleware,errorHandler, roleMiddleware('admin'), adminPlanController.updatePlan);
router.delete('/:planId', authMiddleware,errorHandler, roleMiddleware('admin'), adminPlanController.deletePlan);

module.exports = router;
