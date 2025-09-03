const express = require('express');
const router = express.Router();
const subscriptionController = require('../../controllers/admin/AdminSubscriptionController.js')
const authMiddleware = require('../../middleware/authMiddleware.js');
const roleMiddleware = require('../../middleware/roleMiddleware.js');

router.post('/create-order',authMiddleware,roleMiddleware(['admin']), subscriptionController.createSubscriptionOrder);
router.post('/verify-payment',authMiddleware,roleMiddleware(['admin']) , subscriptionController.verifyAndActivateSubscription);

module.exports = router;
