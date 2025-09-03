const express = require('express');
const router = express.Router();
const controller = require('../../controllers/admin/appointmentController.js');



// ✅ Free appointment (no payment)
router.post('/free', controller.createFreeAppointment);

// ✅ Paid appointment after payment success
router.post('/paid', controller.createPaidAppointment);

// ✅ Razorpay Payment Verification
router.post('/verify-payment', controller.verifyPayment);

// 📋 All appointments (admin view)
router.get('/', controller.getAllAppointments);

// 🧑 Unique clients (grouped by clientId)
router.get('/clients', controller.getUniqueClients);

// 🔍 Single appointment
router.get('/:id', controller.getAppointmentById);



// 📆 Booked slots by date (for calendar UI)
router.get('/booked-slots/:date', controller.getBookedSlotsByDate);

// 🔄 Update full appointment (admin side)
router.patch('/update/:id', controller.patchUpdateAppointment);

// ✂️ Delete appointment
router.delete('/delete/:id', controller.deleteAppointment);

// 🧾 Generate PDF invoice (base64 format)
router.get('/invoice/:id', controller.generateInvoice);

// ✉️ Send email reminder manually
router.post('/send-reminder/:id', controller.sendReminder);

// 🔁 Update all records by userId (used in profile edit)
router.patch('/update-user/:userId', controller.updateUserInfoByUserId);

// ❌ Delete all appointments of a client (admin side bulk delete)
router.delete('/by-user/:userId', controller.deleteAppointmentsByUserId);

// 📊 Get status-wise counts (Scheduled, Pending, Cancelled)
router.get('/all/status-counts', controller.getStatusCounts);

// 📁 Filter appointments by adminId
router.get('/admin/:adminId', controller.getAppointmentsByAdmin);

module.exports = router;
