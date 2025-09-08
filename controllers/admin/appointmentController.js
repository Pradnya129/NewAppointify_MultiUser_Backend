const Razorpay = require('razorpay');
const crypto = require('crypto');
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const EmailService = require('../../utils/emailService');
const CustomerAppointment = require('../../models/admin/CustomerAppointmentsModel.js');
const Admin = require('../../models/admin/AdminAccountModel.js');
const generateAppointmentPDF = require('../../utils/pdfGenerator');
const sendEmail = require('../../utils/email'); // <-- Implement your own mail util
// ⚙️ Configure Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET
});

// 📌 POST /api/appointments/paid
exports.createPaidAppointment = async (req, res, next) => {
    try {
        const {
            adminId,
            firstName,
            lastName,
            email,
            phoneNumber,
            duration,
            appointmentTime,
            appointmentDate,
            plan,
            details,
            amount
        } = req.body;

        // 🔍 Try to reuse clientId based on email or phone
        let existing = await CustomerAppointment.findOne({
            where: {
                [Op.or]: [{ email }, { phoneNumber }]
            },
            order: [['createdAt', 'DESC']]
        });

        const clientId = existing?.clientId || uuidv4();

        // ✅ Create appointment (initial state)
        const appointment = await CustomerAppointment.create({
            clientId,
            adminId,
            firstName,
            lastName,
            email,
            phoneNumber,
            duration,
            appointmentTime,
            appointmentDate,
            plan,
            details,
            amount,
            paymentStatus: 'Pending',
            appointmentStatus: 'Pending',
            paymentMethod: 'Online'
        });

        // 💳 Create Razorpay order
        const razorpayOrder = await razorpay.orders.create({
            amount: parseFloat(amount) * 100,
            currency: 'INR',
            receipt: appointment.id,
            payment_capture: 1
        });

        appointment.orderId = razorpayOrder.id;
        await appointment.save();

        res.status(201).json({
            success: true,
            message: 'Appointment created. Awaiting payment.',
            data: {
                orderId: razorpayOrder.id,
                appointmentId: appointment.id,
                razorpayKey: process.env.RAZORPAY_KEY,
                amount: razorpayOrder.amount,
                name: `${firstName} ${lastName}`,
                email,
                phoneNumber
            }
        });
    } catch (err) {
        console.error('❌ Error in createPaidAppointment:', err);
        next(err);
    }
};

// 📌 POST /api/customer-appointments/verify-payment
exports.verifyPayment = async (req, res, next) => {
    try {
        const { orderId, paymentId, signature } = req.body;

        if (!orderId || !paymentId || !signature)
            return res.status(400).json({ success: false, message: 'Missing fields' });

        const body = `${orderId}|${paymentId}`;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_SECRET)
            .update(body)
            .digest('hex');

        if (expectedSignature !== signature)
            return res.status(400).json({ success: false, message: 'Invalid signature' });

        const appointment = await CustomerAppointment.findOne({ where: { orderId } });

        if (!appointment)
            return res.status(404).json({ success: false, message: 'Appointment not found' });

        appointment.paymentId = paymentId;
        appointment.paymentStatus = 'Paid';
        appointment.appointmentStatus = 'Scheduled';
        appointment.paymentMethod = 'Online';
        await appointment.save();

        res.json({
            success: true,
            message: 'Payment verified and appointment scheduled',
            paymentId,
            appointmentStatus: appointment.appointmentStatus
        });
    } catch (err) {
        next(err);
    }
};

// 📌 POST /api/appointments/free
exports.createFreeAppointment = async (req, res, next) => {
    try {
        const {
            adminId,
            firstName,
            lastName,
            email,
            phoneNumber,
            duration,
            appointmentTime,
            appointmentDate,
            plan,
            details,
            amount
        } = req.body;

        let clientId;

        // 🟡 Check if user exists by email or phone
        const existing = await CustomerAppointment.findOne({
            where: {
                [Op.or]: [{ email }, { phoneNumber }]
            },
            order: [['createdAt', 'DESC']]
        });

        if (existing) {
            clientId = existing.clientId;
        } else {
            clientId = uuidv4();
        }

        // 🔵 Create appointment
        const appointment = await CustomerAppointment.create({
            clientId,
            adminId,
            firstName,
            lastName,
            email,
            phoneNumber,
            duration,
            appointmentTime,
            appointmentDate,
            plan,
            details,
            amount,
            paymentMethod: 'Manual',
            paymentStatus: 'Pending',
            appointmentStatus: 'Scheduled'
        });

        res.status(201).json({ success: true, data: appointment });
    } catch (err) {
        next(err);
    }
};

// 📌 GET /api/customer-appointments
// 📌 GET /api/customer-appointments
exports.getAllAppointments = async (req, res, next) => {
  try {
    const { id: adminId } = req.user; // comes from JWT payload
    
    const appointments = await CustomerAppointment.findAll({
      where: { adminId }
    });

    res.json({ success: true, data: appointments });
  } catch (err) {
    console.error("Error in getAllAppointments:", err);
    next(err);
  }
};


// 📌 GET /api/customer-appointments/clients/:adminId
// 📌 GET /api/customer-appointments/clients
exports.getUniqueClients = async (req, res, next) => {
  try {
    const { id: adminId } = req.user; // adminId from JWT

    // 🔐 Filter only by adminId
    const all = await CustomerAppointment.findAll({
      where: { adminId }
    });

    if (!all.length) {
      return res.json({
        success: true,
        data: [],
        message: 'No appointments found yet for this admin.'
      });
    }

    const grouped = {};
    all.forEach((appt) => {
      const userId = appt.clientId;
      if (!userId) return;

      if (!grouped[userId]) {
        grouped[userId] = {
          clientId: userId,
          firstName: appt.firstName,
          lastName: appt.lastName,
          email: appt.email,
          phoneNumber: appt.phoneNumber,
          totalAppointments: 1,
          lastAppointment: appt.createdAt
        };
      } else {
        grouped[userId].totalAppointments += 1;
        grouped[userId].lastAppointment =
          new Date(appt.createdAt) > new Date(grouped[userId].lastAppointment)
            ? appt.createdAt
            : grouped[userId].lastAppointment;
      }
    });

    res.json({ success: true, data: Object.values(grouped) });
  } catch (err) {
    console.error('Error in getUniqueClients:', err);
    next(err);
  }
};



// 📌 PATCH /api/customer-appointments/:id
exports.patchUpdateAppointment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        const existing = await CustomerAppointment.findByPk(id);
        if (!existing) return res.status(404).json({ success: false, message: 'Appointment not found.' });

        const isScheduledNow = updatedData.appointmentStatus === 'Scheduled';
        const isRescheduledNow = updatedData.appointmentStatus === 'Rescheduled';

        // Update individual fields
        existing.firstName = updatedData.firstName ?? existing.firstName;
        existing.lastName = updatedData.lastName ?? existing.lastName;
        existing.email = updatedData.email ?? existing.email;
        existing.plan = updatedData.plan ?? existing.plan;
        existing.phoneNumber = updatedData.phoneNumber ?? existing.phoneNumber;
        existing.amount = updatedData.amount ?? existing.amount;
        existing.details = updatedData.details ?? existing.details;
        existing.paymentId = updatedData.paymentId ?? existing.paymentId;
        existing.paymentStatus = updatedData.paymentStatus ?? existing.paymentStatus;
        existing.appointmentTime = updatedData.appointmentTime ?? existing.appointmentTime;
        existing.appointmentDate = updatedData.appointmentDate ?? existing.appointmentDate;
        existing.paymentMethod = updatedData.paymentMethod ?? existing.paymentMethod;
        existing.appointmentStatus = updatedData.appointmentStatus ?? existing.appointmentStatus;
        existing.duration = updatedData.duration ?? existing.duration;
        existing.updatedAt = new Date(); // Sequelize will do this automatically, but just in case

        await existing.save();

        // 📧 Send email only if status changed to Scheduled or Rescheduled
        if (isScheduledNow || isRescheduledNow) {
            const actionText = isRescheduledNow ? 'Rescheduled' : 'Scheduled';

            const subject = `Appointment ${actionText} - ${existing.firstName} ${existing.lastName} - ${existing.phoneNumber}`;

            const bodyForUser = `
Dear ${existing.firstName} ${existing.lastName},

Your appointment has been ${actionText.toLowerCase()} successfully. Please find the details below:

------------------------------------------------------------
 Date       : ${existing.appointmentDate}
 Time       : ${existing.appointmentTime}
 Plan       : ${existing.plan}
 Duration   : ${existing.duration} minutes
 Amount     : ₹${existing.amount}
 Payment ID : ${existing.paymentId || 'N/A'}
------------------------------------------------------------

If you have any questions, feel free to contact us.

Warm regards,  
Atul Sardesai
`;

            const bodyForConsultant = `
Hello Consultant,

The appointment for ${existing.firstName} ${existing.lastName} has been ${actionText.toLowerCase()}. Details are as follows:

------------------------------------------------------------
 Date       : ${existing.appointmentDate}
 Time       : ${existing.appointmentTime}
 Plan       : ${existing.plan}
 Duration   : ${existing.duration} minutes
 Amount     : ₹${existing.amount}
 Payment ID : ${existing.paymentId || 'N/A'}
------------------------------------------------------------

Please be prepared accordingly.
`;

            
            await EmailService.sendAppointmentEmail(existing.email, subject, bodyForUser);
            await EmailService.sendAppointmentEmail("pradnyamandekar129@gmail.com", subject, bodyForConsultant);
        }

        res.json({ success: true, message: 'Appointment updated', data: existing });
    } catch (err) {
        console.error("❌ Error in patchUpdateAppointment:", err);
        next(err);
    }
};

// 📌 DELETE /api/customer-appointments/:id
exports.deleteAppointment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleted = await CustomerAppointment.destroy({ where: { id } });

        if (!deleted) return res.status(404).json({ message: 'Not found' });

        res.json({ success: true, message: 'Deleted successfully' });
    } catch (err) {
        next(err);
    }
};

// 📌 GET /api/customer-appointments/booked-slots/:date
exports.getBookedSlotsByDate = async (req, res, next) => {
    try {
        const { date } = req.params;

        const appointments = await CustomerAppointment.findAll({
            where: {
                appointmentDate: date,
                appointmentStatus: {
                    [Op.not]: 'Cancelled'
                }
            }
        });

        const slots = appointments.map((appt) => {
            const [start, end] = appt.appointmentTime.split('-').map(t => t.trim());
            return {
                startTime: start,
                endTime: end,
                originalTime: appt.appointmentTime,
                status: appt.appointmentStatus
            };
        });

        res.json({ success: true, data: slots });
    } catch (err) {
        next(err);
    }
};

// Get single appointment by ID

exports.getAppointmentById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const appointment = await CustomerAppointment.findByPk(id);
        if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

        res.json({ success: true, data: appointment });
    } catch (err) {
        next(err);
    }
};


// 🔹 2. PATCH /api/customer-appointments/update-user/:userId
// 🔄 Update user info by userId across all appointments

// 📌 PATCH /api/customer-appointments/update-user/:userId
exports.updateUserInfoByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { firstName, lastName, email, phoneNumber } = req.body;

    const appointments = await CustomerAppointment.findAll({ where: { clientId: userId } });

    if (!appointments.length) {
      return res.status(404).json({
        success: false,
        message: 'No appointments found for the given user'
      });
    }

    await Promise.all(appointments.map(appointment => {
      appointment.firstName = firstName ?? appointment.firstName;
      appointment.lastName = lastName ?? appointment.lastName;
      appointment.email = email ?? appointment.email;
      appointment.phoneNumber = phoneNumber ?? appointment.phoneNumber;
      appointment.updatedAt = new Date(); // optional if Sequelize is auto-handling
      return appointment.save();
    }));

    res.json({
      success: true,
      message: 'User info updated for all appointments'
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/customer-appointments/by-user/:userId
// 🗑 Delete all appointments for a user

exports.deleteAppointmentsByUserId = async (req, res, next) => {
    try {
        const { userId } = req.params;

        const deleted = await CustomerAppointment.destroy({ where: { clientId: userId } });
        if (!deleted) return res.status(404).json({ message: 'No appointments found for this user' });

        res.json({ success: true, message: 'All appointments deleted for the user' });
    } catch (err) {
        next(err);
    }
};

// GET /api/customer-appointments/invoice/:id
// 🧾 Generate base64 PDF invoice (mock implementation)

exports.generateInvoice = async (req, res, next) => {
    try {
        const { id } = req.params;
        const appointment = await CustomerAppointment.findByPk(id);
        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

        const base64PDF = await generateAppointmentPDF(appointment);
        res.json({ success: true, invoice: base64PDF });
    } catch (err) {
        next(err);
    }
};

// GET /api/customer-appointments/status-counts
// 📊 Count appointments by status

exports.getStatusCounts = async (req, res, next) => {
    try {
        const [scheduled, completed, cancelled, pending] = await Promise.all([
            CustomerAppointment.count({ where: { appointmentStatus: 'Scheduled' } }),
            CustomerAppointment.count({ where: { appointmentStatus: 'Completed' } }),
            CustomerAppointment.count({ where: { appointmentStatus: 'Cancelled' } }),
            CustomerAppointment.count({ where: { appointmentStatus: 'Pending' } }),
        ]);

        res.json({
            success: true,
            data: {
                Scheduled: scheduled,
                Completed: completed,
                Cancelled: cancelled,
                Pending: pending
            }
        });
    } catch (err) {
        next(err);
    }
};

// GET /api/customer-appointments/admin/:adminId
// 📁 Fetch all appointments for a specific admin

exports.getAppointmentsByAdmin = async (req, res, next) => {
    try {
        const { adminId } = req.params;
        const list = await CustomerAppointment.findAll({ where: { adminId } });
        res.json({ success: true, data: list });
    } catch (err) {
        next(err);
    }
};

// POST /api/customer-appointments/send-reminder/:id
// ✉️ Send email reminder (stub function)



exports.sendReminder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const appointment = await CustomerAppointment.findByPk(id);
        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

        const emailBody = `
      <p>Hi ${appointment.firstName},</p>
      <p>This is a gentle reminder for your appointment:</p>
      <ul>
        <li><strong>Date:</strong> ${appointment.appointmentDate}</li>
        <li><strong>Time:</strong> ${appointment.appointmentTime}</li>
        <li><strong>Plan:</strong> ${appointment.plan}</li>
      </ul>
      <p>Thank you,<br/>Team Appointify</p>
    `;

        await sendEmail(appointment.email, 'Appointment Reminder', emailBody);

        res.json({ success: true, message: 'Reminder email sent' });
    } catch (err) {
        next(err);
    }
};