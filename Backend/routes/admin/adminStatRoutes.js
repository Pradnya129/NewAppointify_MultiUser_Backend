const express = require('express');
const router = express.Router();
const adminStatController = require('../../controllers/admin/adminStatController.js');
const authMiddleware = require('../../middleware/authMiddleware.js');
const roleMiddleware = require('../../middleware/roleMiddleware.js');
// You can add auth middleware if required
router.get('/',authMiddleware, roleMiddleware('admin'), adminStatController.getAllStats);
router.get('/:id',authMiddleware, roleMiddleware('admin'), adminStatController.getStatById);
router.post('/', authMiddleware, roleMiddleware('admin'),adminStatController.createStat);
router.put('/:id',authMiddleware, roleMiddleware('admin'), adminStatController.updateStat);
router.delete('/:id',authMiddleware, roleMiddleware('admin'), adminStatController.deleteStat);

module.exports = router;
