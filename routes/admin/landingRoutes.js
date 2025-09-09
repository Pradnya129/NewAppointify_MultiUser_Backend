const express = require('express');
const router = express.Router();
const landingCtrl = require('../../controllers/admin/landingPageController.js');
const upload = require('../../middleware/upload.js');

// 📍 Create landing data
router.post(
  '/',
  upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'section2_Image', maxCount: 1 }
  ]),
  landingCtrl.createLanding
);

router.patch(
  '/:id',
  upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'section2_Image', maxCount: 1 }
  ]),
  landingCtrl.partialUpdate
);
// 📍 Get landing by adminId
router.get('/:adminId', landingCtrl.getLandingByAdmin);

// 📍 Update fully
router.put('/:id', landingCtrl.updateLanding);


// 📍 Delete landing data
router.delete('/:id', landingCtrl.deleteLanding);

module.exports = router;
