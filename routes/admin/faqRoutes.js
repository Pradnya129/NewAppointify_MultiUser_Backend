const express = require('express');
const router = express.Router();
const faqController = require('../../controllers/admin/faqController.js');
const roleMiddleware = require('../../middleware/roleMiddleware.js');
const authMiddleware = require('../../middleware/authMiddleware.js');
// All routes are protected; only authenticated admins can access
router.get('/',  authMiddleware, roleMiddleware('admin'),faqController.getAllFaqs);
router.get('/:id',authMiddleware, roleMiddleware('admin'),  faqController.getFaqById);
router.post('/', authMiddleware, roleMiddleware('admin'), faqController.createFaq);
router.put('/:id', authMiddleware, roleMiddleware('admin'), faqController.updateFaq);
router.delete('/:id',authMiddleware, roleMiddleware('admin'),  faqController.deleteFaq);

module.exports = router;
