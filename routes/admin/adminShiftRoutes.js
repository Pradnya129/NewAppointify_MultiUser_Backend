const express = require('express');
const router = express.Router();
const shiftController = require('../../controllers/admin/adminShiftcontroller.js');
const authMiddleware = require('../../middleware/authMiddleware.js');
const roleMiddleware = require('../../middleware/roleMiddleware.js');
const errorHandler = require('../../middleware/errorHandler.js');

// Optional: Add middleware like `authenticateAdmin` if needed
router.post('/',authMiddleware,errorHandler, roleMiddleware('admin'), shiftController.createShift);
router.get('/',authMiddleware,errorHandler, roleMiddleware('admin'), shiftController.getAllShifts);
router.get('/',errorHandler, shiftController.getAllShifts);
router.get('/:id',authMiddleware,errorHandler, roleMiddleware('admin'), shiftController.getShiftById);
router.put('/:id',authMiddleware,errorHandler, roleMiddleware('admin'), shiftController.updateShift);
router.delete('/:id',authMiddleware,errorHandler, roleMiddleware('admin'), shiftController.deleteShift);

module.exports = router;
