const express = require('express');
const router = express.Router();
const controller = require('../../controllers/admin/appointmentController.js');
const authMiddleware = require('../../middleware/authMiddleware.js');
const roleMiddleware = require('../../middleware/roleMiddleware.js');


// ✅ Free appointment (no payment)
router.post('/free',authMiddleware, roleMiddleware('admin'), controller.createFreeAppointment);

// ✅ Paid appointment after payment success
router.post('/paid',authMiddleware, roleMiddleware('admin'), controller.createPaidAppointment);

// ✅ Razorpay Payment Verification
router.post('/verify-payment',authMiddleware, roleMiddleware('admin'), controller.verifyPayment);

// 📋 All appointments (admin view)
router.get('/', authMiddleware, roleMiddleware('admin'),controller.getAllAppointments);

// 🧑 Unique clients (grouped by clientId)
router.get('/clients',authMiddleware, roleMiddleware('admin'), controller.getUniqueClients);

// 🔍 Single appointment
router.get('/:id',authMiddleware, roleMiddleware('admin'), controller.getAppointmentById);

// 📆 Booked slots by date (for calendar UI)
router.get('/booked-slots/:date',authMiddleware, roleMiddleware('admin'), controller.getBookedSlotsByDate);

// 🔄 Update full appointment (admin side)
router.patch('/update/:id',authMiddleware, roleMiddleware('admin'), controller.patchUpdateAppointment);

// ✂️ Delete appointment
router.delete('/delete/:id', authMiddleware, roleMiddleware('admin'),controller.deleteAppointment);

// 🧾 Generate PDF invoice (base64 format)
router.get('/invoice/:id',authMiddleware, roleMiddleware('admin'), controller.generateInvoice);

// ✉️ Send email reminder manually
router.post('/send-reminder/:id',authMiddleware, roleMiddleware('admin'), controller.sendReminder);

// 🔁 Update all records by userId (used in profile edit)
router.patch('/update-user/:userId',authMiddleware, roleMiddleware('admin'), controller.updateUserInfoByUserId);

// ❌ Delete all appointments of a client (admin side bulk delete)
router.delete('/by-user/:userId',authMiddleware, roleMiddleware('admin'), controller.deleteAppointmentsByUserId);

// 📊 Get status-wise counts (Scheduled, Pending, Cancelled)
router.get('/all/status-counts',authMiddleware, roleMiddleware('admin'), controller.getStatusCounts);

// 📁 Filter appointments by adminId
router.get('/admin/:adminId',authMiddleware, roleMiddleware('admin'), controller.getAppointmentsByAdmin);


module.exports = router;
