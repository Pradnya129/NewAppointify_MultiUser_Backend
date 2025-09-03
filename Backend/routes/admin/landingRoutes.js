const express = require('express');
const router = express.Router();
const landingCtrl = require('../../controllers/admin/landingPageController.js');
const upload = require('../../middleware/upload.js');

// 📍 Create landing data
router.post(
  '/',
  upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'backgroundImage', maxCount: 1 }
  ]),
  landingCtrl.createLanding
);

// 📍 Get landing by adminId
router.get('/:adminId', landingCtrl.getLandingByAdmin);

// 📍 Update fully
router.put('/:id', landingCtrl.updateLanding);

// 📍 Update partially
router.patch('/:id', landingCtrl.partialUpdate);

// 📍 Delete landing data
router.delete('/:id', landingCtrl.deleteLanding);

module.exports = router;
