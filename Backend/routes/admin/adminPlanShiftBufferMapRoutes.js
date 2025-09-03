// routes/planShiftBufferRuleRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../../controllers/admin/adminPlanShiftBufferMapController.js');
const authMiddleware = require('../../middleware/authMiddleware.js');
const roleMiddleware = require('../../middleware/roleMiddleware.js');

router.get('/all',authMiddleware, roleMiddleware('admin'), controller.getAllRules);
router.get('/:planId', authMiddleware, roleMiddleware('admin'),controller.getRuleByPlanId);
router.post('/add',authMiddleware, roleMiddleware('admin'), controller.createRule);
router.patch('/:id',authMiddleware, roleMiddleware('admin'), controller.patchBufferTimeById);

module.exports = router;
