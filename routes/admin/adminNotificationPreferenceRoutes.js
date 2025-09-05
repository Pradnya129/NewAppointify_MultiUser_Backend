const express = require('express');
const router = express.Router();
const controller = require('../../controllers/admin/adminNotificationPreferenceController.js');
const errorHandler = require('../../middleware/errorHandler.js');
const authMiddleware = require('../../middleware/authMiddleware.js');
const roleMiddleware = require('../../middleware/roleMiddleware.js');
// POST or PUT (upsert) preferences
router.post('/preferences',authMiddleware,roleMiddleware('admin'),errorHandler, controller.setPreference);

router.patch('/preferences/:adminId',authMiddleware,roleMiddleware('admin'),errorHandler, controller.updatePreference);

// GET preferences by adminId
router.get('/preferences/:adminId',authMiddleware,roleMiddleware('admin'),errorHandler, controller.getPreferenceByAdmin);

// DELETE preferences
router.delete('/preferences/:Id',authMiddleware,roleMiddleware('admin'),errorHandler, controller.deletePreferenceById);

module.exports = router;
