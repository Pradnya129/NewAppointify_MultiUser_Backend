// routes/superAdmin/subscriptionRenewalRoutes.js
const express = require('express');
const router = express.Router();
const renewalController = require('../../controllers/superAdmin/subscriptionRenewalController.js');

router.post('/', renewalController.createRenewal);
router.get('/', renewalController.getAllRenewals);
router.get('/:id', renewalController.getRenewalById);
router.put('/:id', renewalController.updateRenewal);
router.delete('/:id', renewalController.deleteRenewal);
router.get('/by-admin/:adminId',renewalController.getRenewalsByAdminId)

module.exports = router;
